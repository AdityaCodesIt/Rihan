import { Ward } from '../types';

export const WARDS: Ward[] = [
  {
    id: 'ward-a',
    name: 'Ward A - Marine West',
    code: 'WRD-A-01',
    population: '142,000',
    councillor: 'Smt. Anjali S. Kulkarni',
    officeAddress: 'Municipal Ward Office, Station Road West, Sector 2',
    center: [19.308, 72.842],
    bounds: [
      [19.300, 72.835],
      [19.316, 72.835],
      [19.316, 72.850],
      [19.300, 72.850]
    ]
  },
  {
    id: 'ward-b',
    name: 'Ward B - Central Market',
    code: 'WRD-B-02',
    population: '185,500',
    councillor: 'Shri Manoj R. Tiwari',
    officeAddress: 'Shivaji Chowk Municipal Building, 3rd Floor',
    center: [19.308, 72.858],
    bounds: [
      [19.300, 72.850],
      [19.316, 72.850],
      [19.316, 72.865],
      [19.300, 72.865]
    ]
  },
  {
    id: 'ward-c',
    name: 'Ward C - Tech Corridor',
    code: 'WRD-C-03',
    population: '160,200',
    councillor: 'Dr. Sameer V. Merchant',
    officeAddress: 'Cyber Tech Park civic hub, MIDC Phase 1',
    center: [19.324, 72.842],
    bounds: [
      [19.316, 72.835],
      [19.332, 72.835],
      [19.332, 72.850],
      [19.316, 72.850]
    ]
  },
  {
    id: 'ward-d',
    name: 'Ward D - Green Park & Hills',
    code: 'WRD-D-04',
    population: '115,000',
    councillor: 'Smt. Rekha B. Patil',
    officeAddress: 'Botanical Road Community Hall, Hill View Colony',
    center: [19.324, 72.858],
    bounds: [
      [19.316, 72.850],
      [19.332, 72.850],
      [19.332, 72.865],
      [19.316, 72.865]
    ]
  },
  {
    id: 'ward-e',
    name: 'Ward E - Old Heritage Fort',
    code: 'WRD-E-05',
    population: '138,400',
    councillor: 'Shri Vikram K. Sawant',
    officeAddress: 'Kotwali Gate Heritage Office, Bazaar Peth',
    center: [19.292, 72.842],
    bounds: [
      [19.284, 72.835],
      [19.300, 72.835],
      [19.300, 72.850],
      [19.284, 72.850]
    ]
  },
  {
    id: 'ward-f',
    name: 'Ward F - Port & Fishery Wharf',
    code: 'WRD-F-06',
    population: '98,000',
    councillor: 'Shri Damodar T. Koli',
    officeAddress: 'Fisheries Terminal Road, Koliwada Chowk',
    center: [19.292, 72.828],
    bounds: [
      [19.284, 72.820],
      [19.300, 72.820],
      [19.300, 72.835],
      [19.284, 72.835]
    ]
  },
  {
    id: 'ward-g',
    name: 'Ward G - Metro Junction East',
    code: 'WRD-G-07',
    population: '192,800',
    councillor: 'Smt. Neelam P. Sharma',
    officeAddress: 'Line 2 Metro Terminal Complex, Eastern Express Hub',
    center: [19.308, 72.872],
    bounds: [
      [19.300, 72.865],
      [19.316, 72.865],
      [19.316, 72.880],
      [19.300, 72.880]
    ]
  },
  {
    id: 'ward-h',
    name: 'Ward H - Riverdale Creek',
    code: 'WRD-H-08',
    population: '124,100',
    councillor: 'Shri Ashok N. Gaikwad',
    officeAddress: 'Creek Ring Road Sub-center, Near Causeway',
    center: [19.324, 72.872],
    bounds: [
      [19.316, 72.865],
      [19.332, 72.865],
      [19.332, 72.880],
      [19.316, 72.880]
    ]
  }
];

export const getWardById = (id: string): Ward => {
  return WARDS.find((w) => w.id === id) || WARDS[0];
};

export const getWardFromCoordinates = (lat: number, lng: number): Ward => {
  for (const ward of WARDS) {
    const minLat = Math.min(...ward.bounds.map((b) => b[0]));
    const maxLat = Math.max(...ward.bounds.map((b) => b[0]));
    const minLng = Math.min(...ward.bounds.map((b) => b[1]));
    const maxLng = Math.max(...ward.bounds.map((b) => b[1]));

    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return ward;
    }
  }

  // Fallback to closest ward by Euclidean distance
  let closest = WARDS[0];
  let minDistance = Infinity;

  for (const ward of WARDS) {
    const d = Math.hypot(ward.center[0] - lat, ward.center[1] - lng);
    if (d < minDistance) {
      minDistance = d;
      closest = ward;
    }
  }

  return closest;
};
