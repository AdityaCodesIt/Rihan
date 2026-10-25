import { Department } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'roads',
    name: {
      en: 'Roads & Potholes',
      hi: 'सड़क एवं गड्ढे निवारण',
      mr: 'रस्ते व खड्डे निवारण'
    },
    icon: 'Hammer',
    color: '#FFB020', // Amber
    slaHours: { critical: 4, high: 24, medium: 72, low: 168 },
    headOfficer: 'Er. Rajesh Deshmukh',
    officers: [
      {
        id: 'off-roads-1',
        name: 'Er. Rajesh Deshmukh',
        designation: 'Executive Engineer (Road Infrastructure)',
        phone: '+91 98201 44521',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=RajeshDeshmukh',
        departmentId: 'roads',
        wardId: 'ward-a'
      },
      {
        id: 'off-roads-2',
        name: 'Suresh Patil',
        designation: 'Assistant Road Inspector',
        phone: '+91 98202 89312',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SureshPatil',
        departmentId: 'roads',
        wardId: 'ward-b'
      },
      {
        id: 'off-roads-3',
        name: 'Pooja Kadam',
        designation: 'Junior Engineer (Asphalt Works)',
        phone: '+91 98204 77621',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=PoojaKadam',
        departmentId: 'roads',
        wardId: 'ward-c'
      }
    ]
  },
  {
    id: 'solid-waste',
    name: {
      en: 'Solid Waste Management',
      hi: 'ठोस कचरा प्रबंधन',
      mr: 'घनकचरा व्यवस्थापन'
    },
    icon: 'Trash2',
    color: '#2DE2C4', // Teal
    slaHours: { critical: 4, high: 12, medium: 48, low: 96 },
    headOfficer: 'Dr. Anand Shinde',
    officers: [
      {
        id: 'off-waste-1',
        name: 'Dr. Anand Shinde',
        designation: 'Chief Sanitation Supervisor',
        phone: '+91 98331 11209',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=AnandShinde',
        departmentId: 'solid-waste',
        wardId: 'ward-a'
      },
      {
        id: 'off-waste-2',
        name: 'Sunita Gaikwad',
        designation: 'Ward Hygiene Officer',
        phone: '+91 98333 44872',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SunitaGaikwad',
        departmentId: 'solid-waste',
        wardId: 'ward-d'
      },
      {
        id: 'off-waste-3',
        name: 'Mahesh Jadhav',
        designation: 'Cleanliness Field Lead',
        phone: '+91 98335 90123',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=MaheshJadhav',
        departmentId: 'solid-waste',
        wardId: 'ward-e'
      }
    ]
  },
  {
    id: 'water-supply',
    name: {
      en: 'Water Supply & Pipelines',
      hi: 'जल आपूर्ति एवं पाइपलाइन',
      mr: 'पाणी पुरवठा व पाईपलाईन'
    },
    icon: 'Droplets',
    color: '#38BDF8', // Sky Blue
    slaHours: { critical: 4, high: 18, medium: 48, low: 120 },
    headOfficer: 'Er. Sandeep Bhosle',
    officers: [
      {
        id: 'off-water-1',
        name: 'Er. Sandeep Bhosle',
        designation: 'Hydraulic Engineer',
        phone: '+91 98670 99411',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SandeepBhosle',
        departmentId: 'water-supply',
        wardId: 'ward-c'
      },
      {
        id: 'off-water-2',
        name: 'Meena Tawde',
        designation: 'Pipeline Maintenance Officer',
        phone: '+91 98672 55219',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=MeenaTawde',
        departmentId: 'water-supply',
        wardId: 'ward-g'
      },
      {
        id: 'off-water-3',
        name: 'Vinayak Salunke',
        designation: 'Pressure Distribution Inspector',
        phone: '+91 98677 33490',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=VinayakSalunke',
        departmentId: 'water-supply',
        wardId: 'ward-f'
      }
    ]
  },
  {
    id: 'drainage',
    name: {
      en: 'Drainage & Storm Sewerage',
      hi: 'जल निकासी एवं सीवरेज',
      mr: 'सांडपाणी व नाले व्यवस्थापन'
    },
    icon: 'Waves',
    color: '#06B6D4', // Cyan
    slaHours: { critical: 3, high: 12, medium: 36, low: 96 },
    headOfficer: 'Er. Nitin More',
    officers: [
      {
        id: 'off-drain-1',
        name: 'Er. Nitin More',
        designation: 'Storm Water Drainage Lead',
        phone: '+91 98210 12890',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=NitinMore',
        departmentId: 'drainage',
        wardId: 'ward-b'
      },
      {
        id: 'off-drain-2',
        name: 'Ajay Kadam',
        designation: 'Sewer Pump Station Head',
        phone: '+91 98212 99401',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=AjayKadam',
        departmentId: 'drainage',
        wardId: 'ward-h'
      },
      {
        id: 'off-drain-3',
        name: 'Radhika Sawant',
        designation: 'Culvert & De-silting Officer',
        phone: '+91 98215 67123',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=RadhikaSawant',
        departmentId: 'drainage',
        wardId: 'ward-a'
      }
    ]
  },
  {
    id: 'electrical',
    name: {
      en: 'Street Lighting & Electrical',
      hi: 'स्ट्रीट लाइट एवं विद्युत व्यवस्था',
      mr: 'रस्त्यावरील दिवे व विद्युत विभाग'
    },
    icon: 'Zap',
    color: '#FBBF24', // Yellow Amber
    slaHours: { critical: 2, high: 16, medium: 48, low: 120 },
    headOfficer: 'Er. Deepak Joshi',
    officers: [
      {
        id: 'off-elec-1',
        name: 'Er. Deepak Joshi',
        designation: 'Superintending Electrical Engineer',
        phone: '+91 98450 78120',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=DeepakJoshi',
        departmentId: 'electrical',
        wardId: 'ward-e'
      },
      {
        id: 'off-elec-2',
        name: 'Prakash Rane',
        designation: 'Feeder Pillar Inspector',
        phone: '+91 98452 33491',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=PrakashRane',
        departmentId: 'electrical',
        wardId: 'ward-c'
      },
      {
        id: 'off-elec-3',
        name: 'Sneha Chaugule',
        designation: 'LED Smart Grid Technician',
        phone: '+91 98458 90182',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SnehaChaugule',
        departmentId: 'electrical',
        wardId: 'ward-g'
      }
    ]
  },
  {
    id: 'health',
    name: {
      en: 'Health & Public Sanitation',
      hi: 'स्वास्थ्य एवं सार्वजनिक स्वच्छता',
      mr: 'आरोग्य व सार्वजनिक स्वच्छता'
    },
    icon: 'Activity',
    color: '#10B981', // Emerald
    slaHours: { critical: 4, high: 24, medium: 72, low: 144 },
    headOfficer: 'Dr. Kavita Narvekar',
    officers: [
      {
        id: 'off-health-1',
        name: 'Dr. Kavita Narvekar',
        designation: 'Medical Officer of Health (MOH)',
        phone: '+91 98920 11983',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=KavitaNarvekar',
        departmentId: 'health',
        wardId: 'ward-a'
      },
      {
        id: 'off-health-2',
        name: 'Rohan Tambe',
        designation: 'Vector Control & Fogging Officer',
        phone: '+91 98922 47812',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=RohanTambe',
        departmentId: 'health',
        wardId: 'ward-f'
      },
      {
        id: 'off-health-3',
        name: 'Varsha Mhatre',
        designation: 'Public Clinic Coordinator',
        phone: '+91 98929 88123',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=VarshaMhatre',
        departmentId: 'health',
        wardId: 'ward-b'
      }
    ]
  },
  {
    id: 'encroachment',
    name: {
      en: 'Encroachment & Building Safety',
      hi: 'अतिक्रमण एवं भवन सुरक्षा',
      mr: 'अतिक्रमण व इमारत सुरक्षा'
    },
    icon: 'Building2',
    color: '#F43F5E', // Rose
    slaHours: { critical: 6, high: 36, medium: 96, low: 240 },
    headOfficer: 'Pradeep Thorat',
    officers: [
      {
        id: 'off-enc-1',
        name: 'Pradeep Thorat',
        designation: 'Assistant Commissioner (Removal of Encroachment)',
        phone: '+91 98190 66245',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=PradeepThorat',
        departmentId: 'encroachment',
        wardId: 'ward-d'
      },
      {
        id: 'off-enc-2',
        name: 'Alok Dixit',
        designation: 'Structural Audit Inspector',
        phone: '+91 98192 11094',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=AlokDixit',
        departmentId: 'encroachment',
        wardId: 'ward-h'
      },
      {
        id: 'off-enc-3',
        name: 'Shilpa Vernekar',
        designation: 'Right-of-Way Officer',
        phone: '+91 98199 44821',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=ShilpaVernekar',
        departmentId: 'encroachment',
        wardId: 'ward-c'
      }
    ]
  },
  {
    id: 'parks',
    name: {
      en: 'Parks & Garden Maintenance',
      hi: 'उद्यान एवं वृक्ष संवर्धन',
      mr: 'उद्याने व वृक्ष संवर्धन'
    },
    icon: 'Trees',
    color: '#84CC16', // Lime
    slaHours: { critical: 6, high: 48, medium: 96, low: 240 },
    headOfficer: 'Anil Sonawane',
    officers: [
      {
        id: 'off-park-1',
        name: 'Anil Sonawane',
        designation: 'Superintendent of Gardens',
        phone: '+91 98230 45129',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=AnilSonawane',
        departmentId: 'parks',
        wardId: 'ward-e'
      },
      {
        id: 'off-park-2',
        name: 'Jyoti Bapat',
        designation: 'Tree Pruning & Emergency Crew Lead',
        phone: '+91 98234 88192',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=JyotiBapat',
        departmentId: 'parks',
        wardId: 'ward-d'
      },
      {
        id: 'off-park-3',
        name: 'Ganesh More',
        designation: 'Horticulture Supervisor',
        phone: '+91 98239 12348',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=GaneshMore',
        departmentId: 'parks',
        wardId: 'ward-f'
      }
    ]
  },
  {
    id: 'traffic',
    name: {
      en: 'Traffic & Signage Coordination',
      hi: 'यातायात एवं सड़क संकेत',
      mr: 'वाहतूक व दिशादर्शक व्यवस्था'
    },
    icon: 'Compass',
    color: '#8B7CFF', // Violet
    slaHours: { critical: 2, high: 24, medium: 72, low: 168 },
    headOfficer: 'Vikram Rajput',
    officers: [
      {
        id: 'off-traf-1',
        name: 'Vikram Rajput',
        designation: 'Traffic Engineering Officer',
        phone: '+91 98700 32187',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=VikramRajput',
        departmentId: 'traffic',
        wardId: 'ward-g'
      },
      {
        id: 'off-traf-2',
        name: 'Anita Shenoy',
        designation: 'Signage & Bollards Inspector',
        phone: '+91 98704 90122',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=AnitaShenoy',
        departmentId: 'traffic',
        wardId: 'ward-b'
      },
      {
        id: 'off-traf-3',
        name: 'Sameer Sheikh',
        designation: 'Pedestrian Zebra & Crossing Officer',
        phone: '+91 98709 54310',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=SameerSheikh',
        departmentId: 'traffic',
        wardId: 'ward-a'
      }
    ]
  },
  {
    id: 'animals',
    name: {
      en: 'Stray Animals & Veterinary',
      hi: 'आवारा पशु एवं पशु चिकित्सा',
      mr: 'भटके प्राणी व पशुवैद्यकीय'
    },
    icon: 'PawPrint',
    color: '#FB923C', // Orange
    slaHours: { critical: 3, high: 24, medium: 72, low: 144 },
    headOfficer: 'Dr. Ritesh Kelkar',
    officers: [
      {
        id: 'off-anim-1',
        name: 'Dr. Ritesh Kelkar',
        designation: 'Chief Veterinary Officer',
        phone: '+91 98340 77129',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=RiteshKelkar',
        departmentId: 'animals',
        wardId: 'ward-h'
      },
      {
        id: 'off-anim-2',
        name: 'Shankar Mane',
        designation: 'Animal Rescue Unit In-Charge',
        phone: '+91 98345 88921',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=ShankarMane',
        departmentId: 'animals',
        wardId: 'ward-e'
      },
      {
        id: 'off-anim-3',
        name: 'Priyanka Ghate',
        designation: 'Canine Sterilization Coordinator',
        phone: '+91 98349 22108',
        avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=PriyankaGhate',
        departmentId: 'animals',
        wardId: 'ward-d'
      }
    ]
  }
];

export const getDepartmentById = (id: string): Department => {
  return DEPARTMENTS.find((d) => d.id === id) || DEPARTMENTS[0];
};

export const getRandomOfficer = (deptId: string): Department['officers'][0] => {
  const dept = getDepartmentById(deptId);
  return dept.officers[Math.floor(Math.random() * dept.officers.length)];
};
