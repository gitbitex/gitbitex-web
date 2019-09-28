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

import { Dom, Prop, Watch, Component} from "./../../component";

@Dom('format-number', require('./number.jade')())
export class NumberFormatComponent extends Component {

    @Prop()
    num: number;

    @Prop()
    fixed: number;

    v1: string = '';
    v2: string = '';
    numFixed: string;

    mounted() {
        super.mounted();
        this.onNumChange();
    }

    @Watch('num')
    onNumChange() {

        this.numFixed = this.fixed ? this.num.toFixed(this.fixed) : String(this.num);
        this.v1 = String(Number(this.numFixed));
        this.v2 = this.numFixed.substr(this.v1.length);
    }

}