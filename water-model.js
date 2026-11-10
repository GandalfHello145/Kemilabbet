/**
 * Vattenlabbet: a constant-pressure, equilibrium school model of 50 g of water.
 *
 * energyJ is enthalpy relative to solid water at 0 °C, not absolute internal
 * energy and not heat added since reset. With constant pressure and no losses,
 * dH = powerWatts * dt. The same mapping is used for heating and cooling.
 * A closed, movable piston keeps the mass constant while the volume can change.
 *
 * Rounded teaching constants, not a precision IAPWS equation of state:
 * - USGS gives liquid water about 4184 J/(kg K).
 * - USACE EM 1110-2-1406, Tables C-3/C-4: ice about 2090 J/(kg K),
 *   fusion about 333500 J/kg.
 * - NISTIR 5078 Table 1 at 100 °C: vaporization about 2256400 J/kg;
 *   Table 3 near 0.10 MPa gives steam enthalpy rises of about 2 kJ/(kg K).
 * We deliberately use constant heat capacities and exact 0/100 °C plateaus.
 */

export const PHASES = Object.freeze({
  SOLID: 'solid',
  MELTING: 'melting',
  LIQUID: 'liquid',
  BOILING: 'boiling',
  GAS: 'gas',
});

export const WATER_CONSTANTS = Object.freeze({
  pressureKPa: 101.3,
  defaultMassKg: 0.05,
  minTemperature: -30,
  meltingTemperature: 0,
  boilingTemperature: 100,
  maxTemperature: 120,
  cpIce: 2100,
  cpLiquid: 4180,
  cpVapor: 2000,
  fusion: 334000,
  vaporization: 2256000,
});

export const MODEL_CARD = Object.freeze({
  title: 'Energimodell för rent vatten',
  description: 'En förenklad jämviktsmodell vid konstant yttre tryck, 101,3 kPa.',
  energyReference: 'Energin räknas från is vid 0 °C. Noll betyder inte att molekylerna saknar energi eller rörelse.',
  assumptions: Object.freeze([
    'Vattenmängden bevaras. Ett rörligt lock låter volymen ändras vid konstant yttre tryck.',
    'All tillförd eller bortförd värme ändrar provets entalpi. Inga värmeförluster eller temperaturgradienter beräknas.',
    'Värmekapaciteter och fasövergångsenergier är avrundade, konstanta undervisningsvärden.',
    'Smältning och frysning sker vid 0 °C; kokning och kondensation sker vid 100 °C.',
    'Fasandelarna är massandelar. Samma H₂O-molekyler finns kvar i alla tre faser.',
    'Tillstånden melting och boiling beskriver blandade faser även när energi förs bort.',
  ]),
  exclusions: Object.freeze([
    'Avdunstning under 100 °C, överkylning, överhettning och fördröjd kärnbildning.',
    'Tryckändringar, föroreningar, kemiska reaktioner och värmeutbyte med omgivningen.',
    'Enskilda molekylers verkliga banor eller en fullständig molekyldynamiksimulering.',
  ]),
  limits: 'Modellen slutar vid −30 °C och 120 °C. Mer värme i samma riktning lagras inte utanför dessa gränser.',
  sources: Object.freeze([
    Object.freeze({
      title: 'USGS: Specific Heat Capacity and Water',
      url: 'https://www.usgs.gov/water-science-school/science/specific-heat-capacity-and-water',
      note: 'Flytande vattens värmekapacitet, cirka 4184 J/(kg·K); modellen använder 4180.',
    }),
    Object.freeze({
      title: 'USACE EM 1110-2-1406, tabeller C-3 och C-4',
      url: 'https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1406.pdf',
      note: 'Isens värmekapacitet cirka 2090 J/(kg·K) och smältenergi cirka 333500 J/kg; avrundas till 2100 och 334000.',
    }),
    Object.freeze({
      title: 'NISTIR 5078: Thermodynamic Properties of Water',
      url: 'https://www.nist.gov/srd/nistir-5078',
      note: 'Tabell 1: ångbildningsentalpi cirka 2256400 J/kg vid 100 °C. Tabell 3: ångans värmekapacitet nära atmosfärstryck cirka 2000 J/(kg·K). Modellen använder 2256000 och 2000.',
    }),
  ]),
});

const C = WATER_CONSTANTS;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
  return value;
}

function validMass(massKg) {
  finite(massKg, 'massKg');
  if (massKg <= 0 || !Number.isFinite(massKg * 4e6)) {
    throw new RangeError('massKg must be positive and within the numerical range');
  }
  return massKg;
}

/**
 * Enthalpy of a pure-phase preset. Temperature is clamped to that phase's
 * equilibrium range. Mixed phases are reached by adding/removing energy.
 */
export function energyForState({
  temperature = 20,
  phase = PHASES.LIQUID,
  massKg = C.defaultMassKg,
} = {}) {
  validMass(massKg);
  finite(temperature, 'temperature');
  switch (phase) {
    case PHASES.SOLID:
      return massKg * C.cpIce * clamp(temperature, C.minTemperature, 0);
    case PHASES.LIQUID:
      return massKg * (C.fusion + C.cpLiquid * clamp(temperature, 0, 100));
    case PHASES.GAS:
      return massKg * (C.fusion + C.cpLiquid * 100 + C.vaporization
        + C.cpVapor * (clamp(temperature, 100, C.maxTemperature) - 100));
    default:
      throw new RangeError('Preset phase must be solid, liquid or gas');
  }
}

export class WaterModel {
  #massKg;
  #energyJ;
  #timeSeconds = 0;
  #minEnergyJ;
  #maxEnergyJ;

  constructor({
    massKg = C.defaultMassKg,
    initialTemperature = 20,
    initialPhase = PHASES.LIQUID,
  } = {}) {
    this.#massKg = validMass(massKg);
    this.#minEnergyJ = energyForState({massKg, temperature: C.minTemperature, phase: PHASES.SOLID});
    this.#maxEnergyJ = energyForState({massKg, temperature: C.maxTemperature, phase: PHASES.GAS});
    this.reset({temperature: initialTemperature, phase: initialPhase});
  }

  get state() {
    const energyJ = this.#energyJ;
    const massKg = this.#massKg;
    const fusionEnd = massKg * C.fusion;
    const boilingStart = massKg * (C.fusion + C.cpLiquid * 100);
    const boilingEnd = massKg * (C.fusion + C.cpLiquid * 100 + C.vaporization);
    let temperature;
    let iceFraction = 0;
    let liquidFraction = 0;
    let vaporFraction = 0;
    let phase;

    if (energyJ <= 0) {
      temperature = clamp(energyJ / (massKg * C.cpIce), C.minTemperature, 0);
      iceFraction = 1;
      phase = PHASES.SOLID;
    } else if (energyJ < fusionEnd) {
      temperature = 0;
      liquidFraction = energyJ / fusionEnd;
      iceFraction = 1 - liquidFraction;
      phase = PHASES.MELTING;
    } else if (energyJ <= boilingStart) {
      temperature = clamp((energyJ - fusionEnd) / (massKg * C.cpLiquid), 0, 100);
      liquidFraction = 1;
      phase = PHASES.LIQUID;
    } else if (energyJ < boilingEnd) {
      temperature = 100;
      vaporFraction = (energyJ - boilingStart) / (massKg * C.vaporization);
      liquidFraction = 1 - vaporFraction;
      phase = PHASES.BOILING;
    } else {
      temperature = clamp(100 + (energyJ - boilingEnd) / (massKg * C.cpVapor), 100, C.maxTemperature);
      vaporFraction = 1;
      phase = PHASES.GAS;
    }

    return Object.freeze({
      temperature,
      iceFraction,
      liquidFraction,
      vaporFraction,
      energyJ,
      massKg,
      phase,
      timeSeconds: this.#timeSeconds,
    });
  }

  /** Advance simulated time in seconds; negative dt is a no-op, not time travel. */
  step(seconds, powerWatts) {
    const dt = Math.max(0, finite(seconds, 'seconds'));
    finite(powerWatts, 'powerWatts');
    this.#energyJ = clamp(this.#energyJ + powerWatts * dt, this.#minEnergyJ, this.#maxEnergyJ);
    this.#timeSeconds = Math.min(Number.MAX_VALUE, this.#timeSeconds + dt);
    return this.state;
  }

  /** Reset keeps the chosen sample mass and starts a new simulated-time clock. */
  reset({temperature = 20, phase = PHASES.LIQUID} = {}) {
    this.#energyJ = energyForState({temperature, phase, massKg: this.#massKg});
    this.#timeSeconds = 0;
    return this.state;
  }
}
