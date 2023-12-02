//pusher
import * as PusherPushNotifications from "@pusher/push-notifications-web";

export const pusher = () => {
    const group = 'hello'
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: 'f6cd0c10-192e-4b49-9851-980cc7a0ab3d',
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest(group))
      .then(() => console.log('Successfully registered and subscribed!'))
      .catch(console.error);
  }