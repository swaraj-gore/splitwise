export class Expense {
  expense_id: number
  description: string
  amount: number
  expense_date: string
  user_id: number
  group_id: number

  constructor(description: string,
              amount: number,
              expense_date: string,
              user_id: number,
              group_id: number) {
    this.description = description
    this.amount = amount
    this.expense_date = expense_date
    this.user_id = user_id
    this.group_id = group_id
  }

}