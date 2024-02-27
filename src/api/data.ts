import { http } from "@/utils/http";

export type Environment = {
    code: number;
    data: {
        dayTime:number,
        humidity:number,
        sunrise:string,
        sunset:string,
        temperatureF:[
            {
                date:string,
                icon:string,
                max:number,
                min:number
            }
        ],
        temperatureI:number,
        temperatureN:{
            date:string,
            icon:string,
            max:number,
            min:number
        },
        temperatureO:number,
        windSpeed:number
    };
    msg:string;
};
export type ConfigResult = {
    code: number;
    data: [{
        day:number,
        power:number
    }];
    msg:string;
};
export type Config = {
    name:string,
    powerRate:number,
    area:number,
    powerLimit:number,
    latitude:number,
    longitude:number,
    powerSwitch:boolean
}
export type DeviceResult = {
    code: number;
    data: [{
        id: number,
        name: string,
        type: string,
        status: string,
        runtime: number,
        powerLimit: number,
        powerSwitch: boolean
    }];
    msg:string;
};


export const getEnvironment= () => {
    return http.request<Environment>("get",`/environment`)
};
export const getConfig= () => {
    return http.request<ConfigResult>("get",`/config`)
};
export const setConfig= (data:any) => {
    return http.request<ConfigResult>("post",`/config`,{data})
};

export const getAllDevice= () => {
    return http.request<DeviceResult>("get",`/all-device`)
};
export const postDevice= (data:any) => {
    return http.request<DeviceResult>("post",`/device`,{data})
};
export const updateDeviceStatus= (data:any) => {
    return http.request<DeviceResult>("post",`/device/status`,{data})
};
export const deleteDevice= (data:any) => {
    return http.request<DeviceResult>("delete",`/device`,{data})
};
export const getDevicesByType= (data:any) => {
    return http.request<DeviceResult>("get",`/all-device/type/${data}`)
};
export const getAirConditioning = (data:any) => {
    return http.request<DeviceResult>("get",`device/air-conditioning/${data}`)
};
export const setAirConditioning = (data:any) => {
  return http.request<DeviceResult>("post",`device/air-conditioning`,{data})
};
export const getDeviceByPage= (currentPage:any,size:any) => {
    return http.request<DeviceResult>("get",`/device/page/${currentPage}/${size}`)
};
export const getLogByPage= (currentPage:any,size:any) => {
    return http.request<any>("get",`/log/page/${currentPage}/${size}`)
};
export const getLogByPageAndName= (currentPage:any,size:any,username:any) => {
    return http.request<any>("get",`/log/page/${currentPage}/${size}/${username}`)
};
