import axios from "axios";

console.log("Start to run axois")

axios.get(`/api/public/cytoBand`)
    .then(response  => {
        console.log(response.data);
    })