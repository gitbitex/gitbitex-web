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

import { Service } from './service';

export class FileService extends Service {

    getFileUrl() {
        return this.request.get(`/files/url`);
    }

    upload(file: any) {

        return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void) => {

            this.getFileUrl().then((response: any) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let ui8a = new Uint8Array(reader.result);
                    let xmlHttp=new XMLHttpRequest();
                    xmlHttp.open("PUT", response.url);
                    xmlHttp.send(ui8a.buffer);
                    xmlHttp.onreadystatechange = () => {
                        resolve(response.key);
                    }
                };
                reader.readAsArrayBuffer(file);
                
            });

        })
        

    }

}