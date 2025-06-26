import Toast from "react-native-toast-message";

interface ToastParams {
  title: string;
}

export const showSuccessToast = ({ title }: ToastParams): void => {
  Toast.show({
    type: "success",
    text1: title,
  });
};

export const showErrorToast = ({ title }: ToastParams): void => {
  Toast.show({
    type: "error",
    text1: title,
  });
};
