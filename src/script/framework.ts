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

import { BaseFramework, BaseRouter, BaseStore } from './vendor';

export class Framework {

    static pages: any[];
    static components: any[];

    static initModules(pages: any[], components: any[]) {

        BaseFramework.use(BaseRouter);
        BaseFramework.use(BaseStore);

        this.pages = pages;
        this.components = components;
    }

    static bootstrap() {

        let routes: any[] = [];

        this.pages.forEach((page: any) => {
            routes.push({ path: page.path, component: page, name: page.routeName});
        });

        this.components.forEach((component: any) => {
            BaseFramework.component(component.elementName, component);
        });

        new BaseFramework({
            router: new BaseRouter({
                mode: 'history',
                routes: routes
            })
        }).$mount('#App')

    }

}