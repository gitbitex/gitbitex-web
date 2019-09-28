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

import Vue from "vue";
import Component from 'vue-class-component';
import VueRouter from "vue-router";
import Vuex from 'vuex';

export const BaseFramework = Vue;
export const BaseComponent = Component;
export const BaseRouter = VueRouter;
export const BaseStore =  Vuex;
export const BaseStoreInstance =  Vuex.Store;
export const Moment = (window as any).moment;
export const Collect = (window as any).collect;
export const Chart = (window as any).Highcharts;
