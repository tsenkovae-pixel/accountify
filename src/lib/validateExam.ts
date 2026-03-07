export function validateExamAnswer(
  correctDebit: string[],
  correctCredit: string[],
  userDebit: string,
  userCredit: string
): boolean {
  return correctDebit.includes(userDebit) && correctCredit.includes(userCredit);
}