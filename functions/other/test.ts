import * as moment from 'moment';

function getMonthDate(timestamp: number): number {
  const x = moment(timestamp).utc().startOf('month').startOf('day').valueOf();
  console.log(x);
  return x;
}

export default getMonthDate(1591025160000);
