import { http } from "@/utils/http";
export type DayPower = {
    code: number;
    data: [{
      day:number,
      power:number
    }];
    msg:string;
};
export type DevicePower = {
    code: number;
    data: [{
        name:string,
        limit:number,
        consume:number
    }];
    msg:string;
};

export const getDayPower= (data:number) => {
    return http.request<DayPower>("get",`/day-power/${data}`)
};
export const getDevicePower= (data:number) => {
    return http.request<DayPower>("get",`/device-power/${data}`)
};
