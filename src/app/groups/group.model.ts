export class Group {
  group_id: number;
  name: string;
  created_on: Date;
  total_expense: number;

  constructor(name: string) {
    this.name = name;
    this.created_on = new Date();
    this.total_expense = 0;
  }
}
