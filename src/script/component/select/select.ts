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

import { Dom, Prop, Watch, Emit, Component} from "./../component";

@Dom('v-select', require('./select.jade')())
export class SelectComponent extends Component {

    @Prop()
    options: string[];

    @Prop({default: 'Search for option'})
    placeHoder: string;

    @Prop()
    value: number;

    @Prop()
    search: boolean;

    documentListener: any; 
    showDropdown: boolean = false;
    selectValue: string = '';

    mounted() {
        super.mounted();
        this.onOptionsChange();
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
            this.selectValue = this.selectValue || this.options[this.value];
        });
    }

    get filterOptions() {
        return this.search ? this.options.filter((opt: string) => {
            return opt.toLowerCase().indexOf(this.selectValue.toLowerCase()) >= 0;
        }) : this.options;
    }
    
    @Watch('options')
    onOptionsChange() {
        this.options.length > 0 && (this.selectValue = this.options[this.value]);
    }

    @Emit()
    select(opt: string, index: number) {}

    selectOpt(opt: string, index: number) {
        this.showDropdown = false;
        this.selectValue = opt;
        this.input(index);
    }

    @Emit()
    input(index: number) {}

    clear() {
        this.selectValue = '';
    }

    dropDown() {
        this.showDropdown = true;
        this.selectValue = '';

    }

}