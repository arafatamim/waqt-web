export default async function getCurrentPosition() {
  return new Promise<[lat: number, long: number]>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve([coords.latitude, coords.longitude]),
      reject
    );
  });
}
