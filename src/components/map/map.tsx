// "use client";
// import { useEffect } from "react";
// import goongjs from "@goongmaps/goong-js";
// import goongClient, { Client } from "@goongmaps/goong-sdk";
// import { DirectionsService } from "@goongmaps/goong-sdk/services/directions";
// import goongDirections from "@goongmaps/goong-sdk/services/directions";

// const MapComponent: React.FC = () => {
//   useEffect(() => {
//     goongjs.accessToken = process.env.GOONG_MAP_KEY;

//     const map = new goongjs.Map({
//       container: "map",
//       style: "https://tiles.goong.io/assets/goong_map_web.json", // stylesheet location
//       center: [105.83991, 21.028], // starting position [lng, lat]
//       zoom: 9, // starting zoom
//     });

//     // Clean up the map instance when component unmounts
//     return () => {
//       map.remove();
//     };
//   }, []); // Empty dependency array ensures this effect runs only once on component mount

//   const baseClient: Client = goongClient({
//     accessToken: process.env.GOONG_MAP_KEY,
//   });
//   const directionService: DirectionsService = goongDirections(baseClient);

//   //   directionService
//   //     .getDirections({
//   //       /* your parameters */
//   //     })
//   //     .send()
//   //     .then((response: any) => {
//   //       console.log(response);

//   //       // Handle successful response
//   //     })
//   //     .catch((error: any) => {
//   //       console.log(error);
//   //       // Handle error
//   //     });

//   return (
//     <div
//       id="map"
//       style={{ width: "400px", height: "300px", backgroundColor: "#aaaaaa" }}
//     />
//   );
// };

// export default MapComponent;
