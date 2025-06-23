import Toast from "react-native-toast-message";

export const showSuccessToast = ({ title }) => {
  Toast.show({
    type: "success",
    text1: title,
  });
};

export const showErrorToast = ({ title }) => {
  Toast.show({
    type: "error",
    text1: title,
  });
};
