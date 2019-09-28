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

import { BaseFramework, BaseComponent } from './../vendor';
import { Prop as vueProp, Watch as vueWatch, Emit as vueEmit } from "vue-property-decorator"

export const Prop = vueProp;
export const Watch = vueWatch;
export const Emit = vueEmit;

export function Dom(elementName: string, template: string, props?: string[]) {
    return function (target: any) {
        target.elementName = elementName;
        return BaseComponent({template: template, props: props})(target)
    }
}

export class Component extends BaseFramework {
    
    static elementName: string;

    element: HTMLElement

    mounted() {
        this.element = this.$el;
    }

}