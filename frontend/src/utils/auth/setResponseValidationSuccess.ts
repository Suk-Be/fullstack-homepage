export const setResponseValidationSuccess = (
  message: string,
): { success: boolean; message: string } => {
  return { success: true, message: message };
};