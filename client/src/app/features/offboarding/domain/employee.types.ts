export interface Equipment {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  status: 'ACTIVE' | 'OFFBOARDED';
  email: string;
  equipments: Equipment[];
}
