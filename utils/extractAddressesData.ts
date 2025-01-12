export const extractAddressesData = (addressesData: any[]) => {
  return addressesData.map((value: any) => {
    return {
      place: value.address,
      id: value.id,
      new: false,
      deleted: false,
      main: value.main,
    };
  });
};
