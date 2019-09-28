// Copyright 2019 GitBitEx.com
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import axios from 'axios';

declare var Promise: any;

export class Request {

    static _instance: Request;

    static getInstance() {
        this._instance || (this._instance = new Request());
        return this._instance;
    }

    config: any;

    constructor() {

        axios.interceptors.request.use(function (config) {
            config.url.indexOf('http') == 0 || (config.url = '/api' + config.url);
            config.validateStatus = () => {
                return true;
            };
            return config;
        });
        axios.interceptors.response.use((response) => {
            
            if (response.status < 300) {
                if (response.config.headers['ResponseAll']) {
                    return response;
                }
                else {
                    return response.data;
                }
            }
            else if (response.status == 401) {
                window.location.href = '/account/signin';
            }
            else {
                return Promise.reject(response.data);
            }

        });

    }

    get(uri: string, config: object = {}) {
        return axios.get(uri, config);
    }

    post(uri: string, data: any = {}, config: object = {}) {
        return axios.post(uri, data, config);
    }

    put(uri: string, data: any, config: object = {}) {
        return axios.put(uri, data, config);
    }

    delete(uri: string, config: object = {}) {
        return axios.delete(uri, config);
    }

    all(requests: any[]) {
        return axios.all(requests);
    }

    static spread(fn: any) {
        return axios.all(fn);
    }

}