/* group an array of dictionaries by column key*/ 
export function groupBy(array, key) {
    return array.reduce((r, x) => {
                (r[x[key]] = r[x[key]] || []).push(x);
                return r;
                }, {});
  };

export function getGroups(array, key) {
    return array.reduce((r, x) => {
                if(!r.includes(x[key])) r.push(x[key])
                return r;
                }, []);
};
  