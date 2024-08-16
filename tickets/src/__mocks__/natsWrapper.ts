export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }, // previously mock test

    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          // this is the actual function viz going to invoke when someone tries to call the publish.
          callback();
        }
      ),
  },
};
