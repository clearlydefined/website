// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { primaryColor, secondaryColor, describedColor, secureColor } from '../../../Clearly'

const colors = [primaryColor.color, secondaryColor.color, describedColor.color, secureColor.color]

export default class PageStatus extends Component {
  constructor(props) {
    super(props)

    const temp = {
      '2018-11-08T00:00:00Z': 512,
      '2018-11-09T00:00:00Z': 328,
      '2018-11-10T00:00:00Z': 299,
      '2018-11-11T00:00:00Z': 2123,
      '2018-11-12T00:00:00Z': 474,
      '2018-11-13T00:00:00Z': 719,
      '2018-11-14T00:00:00Z': 323,
      '2018-11-15T00:00:00Z': 302,
      '2018-11-16T00:00:00Z': 328,
      '2018-11-17T00:00:00Z': 532,
      '2018-11-18T00:00:00Z': 312,
      '2018-11-19T00:00:00Z': 6766,
      '2018-11-20T00:00:00Z': 386,
      '2018-11-21T00:00:00Z': 1084,
      '2018-11-22T00:00:00Z': 327,
      '2018-11-23T00:00:00Z': 707,
      '2018-11-24T00:00:00Z': 383,
      '2018-11-25T00:00:00Z': 304,
      '2018-11-26T00:00:00Z': 436,
      '2018-11-27T00:00:00Z': 610,
      '2018-11-28T00:00:00Z': 436,
      '2018-11-29T00:00:00Z': 757,
      '2018-11-30T00:00:00Z': 559,
      '2018-12-01T00:00:00Z': 310,
      '2018-12-02T00:00:00Z': 288,
      '2018-12-03T00:00:00Z': 935,
      '2018-12-04T00:00:00Z': 552,
      '2018-12-05T00:00:00Z': 451,
      '2018-12-06T00:00:00Z': 300,
      '2018-12-07T00:00:00Z': 321,
      '2018-12-08T00:00:00Z': 294,
      '2018-12-09T00:00:00Z': 287,
      '2018-12-10T00:00:00Z': 317,
      '2018-12-11T00:00:00Z': 323,
      '2018-12-12T00:00:00Z': 310,
      '2018-12-13T00:00:00Z': 348,
      '2018-12-14T00:00:00Z': 580,
      '2018-12-15T00:00:00Z': 2428,
      '2018-12-16T00:00:00Z': 298,
      '2018-12-17T00:00:00Z': 587,
      '2018-12-18T00:00:00Z': 1156,
      '2018-12-19T00:00:00Z': 930,
      '2018-12-20T00:00:00Z': 2931,
      '2018-12-21T00:00:00Z': 976,
      '2018-12-22T00:00:00Z': 288,
      '2018-12-23T00:00:00Z': 288,
      '2018-12-24T00:00:00Z': 290,
      '2018-12-25T00:00:00Z': 291,
      '2018-12-26T00:00:00Z': 288,
      '2018-12-27T00:00:00Z': 287,
      '2018-12-28T00:00:00Z': 288,
      '2018-12-29T00:00:00Z': 287,
      '2018-12-30T00:00:00Z': 288,
      '2018-12-31T00:00:00Z': 288,
      '2019-01-01T00:00:00Z': 290,
      '2019-01-02T00:00:00Z': 744,
      '2019-01-03T00:00:00Z': 287,
      '2019-01-04T00:00:00Z': 318,
      '2019-01-05T00:00:00Z': 288,
      '2019-01-06T00:00:00Z': 292,
      '2019-01-07T00:00:00Z': 717,
      '2019-01-08T00:00:00Z': 997,
      '2019-01-09T00:00:00Z': 1307,
      '2019-01-10T00:00:00Z': 512,
      '2019-01-11T00:00:00Z': 836,
      '2019-01-12T00:00:00Z': 336,
      '2019-01-13T00:00:00Z': 288,
      '2019-01-14T00:00:00Z': 546,
      '2019-01-15T00:00:00Z': 357,
      '2019-01-16T00:00:00Z': 328,
      '2019-01-17T00:00:00Z': 1284,
      '2019-01-18T00:00:00Z': 1309,
      '2019-01-19T00:00:00Z': 293,
      '2019-01-20T00:00:00Z': 391,
      '2019-01-21T00:00:00Z': 343,
      '2019-01-22T00:00:00Z': 766,
      '2019-01-23T00:00:00Z': 975,
      '2019-01-24T00:00:00Z': 795,
      '2019-01-25T00:00:00Z': 1729,
      '2019-01-26T00:00:00Z': 297,
      '2019-01-27T00:00:00Z': 295,
      '2019-01-28T00:00:00Z': 698,
      '2019-01-29T00:00:00Z': 1088,
      '2019-01-30T00:00:00Z': 1983,
      '2019-01-31T00:00:00Z': 1776,
      '2019-02-01T00:00:00Z': 707,
      '2019-02-02T00:00:00Z': 288,
      '2019-02-03T00:00:00Z': 289,
      '2019-02-04T00:00:00Z': 456,
      '2019-02-05T00:00:00Z': 865,
      '2019-02-06T00:00:00Z': 4
    }
    const dA = {
      'recomputed definition available': 1806,
      'computed definition available': 11568,
      'definition not available': 794
    }
    const cD = [
      {
        amazon: 76,
        microsoft: 253,
        date: '2018-11-13T00:00:00Z'
      },
      {
        microsoft: 1090,
        amazon: 650,
        date: '2018-11-14T00:00:00Z'
      },
      {
        amazon: 110,
        microsoft: 230,
        date: '2018-11-15T00:00:00Z'
      },
      {
        amazon: 85,
        microsoft: 191,
        date: '2018-11-16T00:00:00Z'
      },
      {
        microsoft: 135,
        amazon: 61,
        date: '2018-11-17T00:00:00Z'
      },
      {
        amazon: 8,
        microsoft: 22,
        date: '2018-11-18T00:00:00Z'
      },
      {
        amazon: 53,
        microsoft: 141,
        date: '2018-11-19T00:00:00Z'
      },
      {
        Google: 11,
        microsoft: 233,
        amazon: 94,
        date: '2018-11-20T00:00:00Z'
      },
      {
        amazon: 99,
        microsoft: 228,
        Google: 13,
        date: '2018-11-21T00:00:00Z'
      },
      {
        microsoft: 75,
        Google: 8,
        amazon: 29,
        date: '2018-11-22T00:00:00Z'
      },
      {
        microsoft: 19,
        Google: 2,
        amazon: 7,
        date: '2018-11-23T00:00:00Z'
      },
      {
        microsoft: 9,
        amazon: 2,
        Google: 1,
        date: '2018-11-24T00:00:00Z'
      },
      {
        Google: 5,
        amazon: 14,
        microsoft: 52,
        date: '2018-11-25T00:00:00Z'
      },
      {
        microsoft: 188,
        amazon: 74,
        Google: 11,
        date: '2018-11-26T00:00:00Z'
      },
      {
        microsoft: 270,
        Google: 18,
        amazon: 103,
        date: '2018-11-27T00:00:00Z'
      },
      {
        microsoft: 376,
        amazon: 164,
        Google: 31,
        date: '2018-11-28T00:00:00Z'
      },
      {
        microsoft: 350,
        amazon: 137,
        Google: 22,
        date: '2018-11-29T00:00:00Z'
      },
      {
        Google: 13,
        amazon: 88,
        microsoft: 191,
        date: '2018-11-30T00:00:00Z'
      },
      {
        Google: 8,
        amazon: 23,
        microsoft: 59,
        date: '2018-12-01T00:00:00Z'
      },
      {
        amazon: 7,
        microsoft: 18,
        date: '2018-12-02T00:00:00Z'
      },
      {
        amazon: 210,
        microsoft: 377,
        Google: 37,
        date: '2018-12-03T00:00:00Z'
      },
      {
        microsoft: 421,
        Google: 34,
        amazon: 164,
        date: '2018-12-04T00:00:00Z'
      },
      {
        microsoft: 333,
        amazon: 176,
        Google: 34,
        date: '2018-12-05T00:00:00Z'
      },
      {
        microsoft: 385,
        amazon: 184,
        Google: 40,
        date: '2018-12-06T00:00:00Z'
      },
      {
        amazon: 550,
        microsoft: 1435,
        Google: 122,
        date: '2018-12-07T00:00:00Z'
      },
      {
        Google: 1697,
        amazon: 8461,
        microsoft: 12716,
        date: '2018-12-08T00:00:00Z'
      },
      {
        amazon: 396,
        microsoft: 648,
        Google: 55,
        date: '2018-12-09T00:00:00Z'
      },
      {
        microsoft: 13026,
        Google: 1745,
        amazon: 8362,
        date: '2018-12-10T00:00:00Z'
      },
      {
        amazon: 9209,
        Google: 1485,
        microsoft: 23251,
        date: '2018-12-11T00:00:00Z'
      },
      {
        Google: 206,
        amazon: 815,
        microsoft: 2277,
        date: '2018-12-12T00:00:00Z'
      },
      {
        Google: 30,
        microsoft: 434,
        amazon: 174,
        date: '2018-12-13T00:00:00Z'
      },
      {
        amazon: 386,
        Google: 128,
        microsoft: 1076,
        date: '2018-12-14T00:00:00Z'
      },
      {
        microsoft: 201,
        Google: 16,
        amazon: 79,
        date: '2018-12-15T00:00:00Z'
      },
      {
        Google: 2,
        microsoft: 9,
        amazon: 3,
        date: '2018-12-16T00:00:00Z'
      },
      {
        Google: 20,
        microsoft: 270,
        amazon: 82,
        date: '2018-12-17T00:00:00Z'
      },
      {
        microsoft: 303,
        amazon: 110,
        Google: 14,
        date: '2018-12-18T00:00:00Z'
      },
      {
        Google: 209,
        amazon: 1396,
        microsoft: 2588,
        date: '2018-12-19T00:00:00Z'
      },
      {
        Google: 7131,
        microsoft: 20644,
        amazon: 15126,
        date: '2018-12-20T00:00:00Z'
      },
      {
        microsoft: 29748,
        amazon: 14856,
        Google: 3807,
        date: '2018-12-21T00:00:00Z'
      },
      {
        microsoft: 38623,
        Google: 10676,
        amazon: 25960,
        date: '2018-12-22T00:00:00Z'
      },
      {
        microsoft: 38312,
        amazon: 28891,
        Google: 11475,
        date: '2018-12-23T00:00:00Z'
      },
      {
        microsoft: 29190,
        Google: 4094,
        amazon: 17900,
        date: '2018-12-24T00:00:00Z'
      },
      {
        Google: 4388,
        microsoft: 31630,
        amazon: 19111,
        date: '2018-12-25T00:00:00Z'
      },
      {
        Google: 4789,
        microsoft: 38591,
        amazon: 21226,
        date: '2018-12-26T00:00:00Z'
      },
      {
        microsoft: 31985,
        Google: 4025,
        amazon: 18623,
        date: '2018-12-27T00:00:00Z'
      },
      {
        amazon: 11462,
        Google: 2494,
        microsoft: 17887,
        date: '2018-12-28T00:00:00Z'
      },
      {
        Google: 1941,
        amazon: 7778,
        microsoft: 16583,
        date: '2018-12-29T00:00:00Z'
      },
      {
        Google: 3152,
        amazon: 16102,
        microsoft: 28644,
        date: '2018-12-30T00:00:00Z'
      },
      {
        microsoft: 30651,
        Google: 3749,
        amazon: 18299,
        date: '2018-12-31T00:00:00Z'
      },
      {
        amazon: 503,
        microsoft: 824,
        Google: 77,
        date: '2019-01-01T00:00:00Z'
      },
      {
        Google: 27,
        amazon: 199,
        microsoft: 379,
        date: '2019-01-02T00:00:00Z'
      },
      {
        amazon: 101,
        microsoft: 228,
        Google: 16,
        date: '2019-01-03T00:00:00Z'
      },
      {
        microsoft: 276,
        Google: 20,
        amazon: 107,
        date: '2019-01-04T00:00:00Z'
      },
      {
        amazon: 48,
        microsoft: 111,
        Google: 7,
        date: '2019-01-05T00:00:00Z'
      },
      {
        microsoft: 15,
        amazon: 4,
        Google: 2,
        date: '2019-01-06T00:00:00Z'
      },
      {
        amazon: 50,
        microsoft: 134,
        Google: 21,
        date: '2019-01-07T00:00:00Z'
      },
      {
        Google: 25,
        microsoft: 326,
        amazon: 95,
        date: '2019-01-08T00:00:00Z'
      },
      {
        amazon: 302,
        Google: 58,
        microsoft: 722,
        date: '2019-01-09T00:00:00Z'
      },
      {
        amazon: 56,
        Google: 12,
        microsoft: 470,
        date: '2019-01-10T00:00:00Z'
      },
      {
        microsoft: 620,
        date: '2019-01-11T00:00:00Z'
      },
      {
        microsoft: 130,
        date: '2019-01-12T00:00:00Z'
      },
      {
        microsoft: 18,
        date: '2019-01-13T00:00:00Z'
      },
      {
        microsoft: 5858,
        date: '2019-01-14T00:00:00Z'
      },
      {
        amazon: 17499,
        microsoft: 30871,
        'microsoft-2': 5832,
        date: '2019-01-15T00:00:00Z'
      },
      {
        Google: 6500,
        amazon: 34989,
        'microsoft-2': 51259,
        microsoft: 29550,
        date: '2019-01-16T00:00:00Z'
      },
      {
        'microsoft-2': 25963,
        microsoft: 3707,
        Google: 2343,
        amazon: 10287,
        date: '2019-01-17T00:00:00Z'
      },
      {
        microsoft: 70,
        'microsoft-2': 2606,
        amazon: 847,
        Google: 128,
        date: '2019-01-18T00:00:00Z'
      },
      {
        microsoft: 1824,
        Google: 3187,
        'microsoft-2': 32486,
        amazon: 12268,
        date: '2019-01-19T00:00:00Z'
      },
      {
        Google: 4,
        'microsoft-2': 68,
        amazon: 29,
        microsoft: 5,
        date: '2019-01-20T00:00:00Z'
      },
      {
        amazon: 23,
        'microsoft-2': 85,
        microsoft: 8,
        Google: 5,
        date: '2019-01-21T00:00:00Z'
      },
      {
        Google: 23,
        microsoft: 44,
        amazon: 139,
        'microsoft-2': 359,
        date: '2019-01-22T00:00:00Z'
      },
      {
        Google: 59,
        'microsoft-2': 697,
        microsoft: 73,
        amazon: 342,
        date: '2019-01-23T00:00:00Z'
      },
      {
        Google: 71,
        'microsoft-2': 815,
        amazon: 316,
        microsoft: 86,
        date: '2019-01-24T00:00:00Z'
      },
      {
        'microsoft-2': 434,
        Google: 29,
        amazon: 183,
        microsoft: 36,
        date: '2019-01-25T00:00:00Z'
      },
      {
        amazon: 49,
        'microsoft-2': 121,
        Google: 10,
        microsoft: 23,
        date: '2019-01-26T00:00:00Z'
      },
      {
        microsoft: 6,
        amazon: 31,
        'microsoft-2': 55,
        Google: 7,
        date: '2019-01-27T00:00:00Z'
      },
      {
        microsoft: 45,
        Google: 30,
        amazon: 141,
        'microsoft-2': 387,
        date: '2019-01-28T00:00:00Z'
      },
      {
        amazon: 570,
        microsoft: 119,
        'microsoft-2': 1477,
        Google: 122,
        date: '2019-01-29T00:00:00Z'
      },
      {
        'microsoft-2': 473,
        amazon: 205,
        microsoft: 52,
        Google: 32,
        date: '2019-01-30T00:00:00Z'
      },
      {
        amazon: 209,
        Google: 38,
        'microsoft-2': 468,
        microsoft: 53,
        date: '2019-01-31T00:00:00Z'
      },
      {
        microsoft: 48,
        Google: 31,
        'microsoft-2': 409,
        amazon: 192,
        date: '2019-02-01T00:00:00Z'
      },
      {
        'microsoft-2': 131,
        amazon: 49,
        microsoft: 9,
        Google: 12,
        date: '2019-02-02T00:00:00Z'
      },
      {
        Google: 2,
        microsoft: 5,
        'microsoft-2': 71,
        amazon: 13,
        date: '2019-02-03T00:00:00Z'
      },
      {
        Google: 26,
        microsoft: 29,
        amazon: 174,
        'microsoft-2': 411,
        date: '2019-02-04T00:00:00Z'
      },
      {
        Google: 39,
        microsoft: 37,
        amazon: 205,
        'microsoft-2': 483,
        date: '2019-02-05T00:00:00Z'
      },
      {
        amazon: 24,
        'microsoft-2': 81,
        microsoft: 4,
        Google: 2,
        date: '2019-02-06T00:00:00Z'
      }
    ]
    const rC = [
      {
        coordinates: 'npm/npmjs/-/jest-junit/6.2.1',
        timestamp: '2019-02-06T01:40:00.564Z'
      },
      {
        coordinates: 'npm/npmjs/@types/puppeteer/1.12.1',
        timestamp: '2019-02-06T01:39:55.888Z'
      },
      {
        coordinates: 'npm/npmjs/-/jest-circus/24.1.0',
        timestamp: '2019-02-06T01:39:30.121Z'
      },
      {
        coordinates: 'npm/npmjs/-/msteams-ui-components-react/0.8.1',
        timestamp: '2019-02-06T01:33:15.751Z'
      },
      {
        coordinates: 'npm/npmjs/-/msteams-ui-icons-core/0.4.1',
        timestamp: '2019-02-06T01:33:14.556Z'
      },
      {
        coordinates: 'npm/npmjs/-/msteams-ui-icons-react/0.4.1',
        timestamp: '2019-02-06T01:33:09.148Z'
      },
      {
        coordinates: 'npm/npmjs/-/msteams-ui-styles-core/0.8.1',
        timestamp: '2019-02-06T01:33:01.735Z'
      },
      {
        coordinates: 'pypi/pypi/-/typed-ast/1.3.1',
        timestamp: '2019-02-06T01:20:06.027Z'
      },
      {
        coordinates: 'maven/mavencentral/net.hockeyapp.android/HockeySDK/5.1.1',
        timestamp: '2019-02-06T01:16:10.809Z'
      },
      {
        coordinates: 'maven/mavencentral/io.reactivex.rxjava2/rxjava/2.2.6',
        timestamp: '2019-02-06T01:09:38.115Z'
      },
      {
        coordinates: 'maven/mavencentral/com.jakewharton/butterknife-compiler/10.0.0',
        timestamp: '2019-02-06T01:06:14.693Z'
      },
      {
        coordinates: 'maven/mavencentral/com.jakewharton/butterknife/10.0.0',
        timestamp: '2019-02-06T01:05:39.763Z'
      },
      {
        coordinates: 'maven/mavencentral/com.jakewharton.picasso/picasso2-okhttp3-downloader/1.1.0',
        timestamp: '2019-02-06T01:04:47.573Z'
      },
      {
        coordinates: 'maven/mavencentral/com.google.dagger/dagger-compiler/2.21',
        timestamp: '2019-02-06T01:04:33.284Z'
      },
      {
        coordinates: 'maven/mavencentral/com.google.dagger/dagger/2.21',
        timestamp: '2019-02-06T01:03:23.21Z'
      },
      {
        coordinates: 'maven/mavencentral/org.mockito/mockito-core/2.24.0',
        timestamp: '2019-02-06T00:46:31.055Z'
      },
      {
        coordinates: 'npm/npmjs/@ts-common/property-set/0.0.10',
        timestamp: '2019-02-06T00:44:08.058Z'
      },
      {
        coordinates: 'npm/npmjs/@ts-common/string-map/0.2.4',
        timestamp: '2019-02-06T00:44:04.601Z'
      },
      {
        coordinates: 'npm/npmjs/@ts-common/source-map/0.4.1',
        timestamp: '2019-02-06T00:44:03.427Z'
      },
      {
        coordinates: 'maven/mavencentral/com.squareup.retrofit2/converter-simplexml/2.5.0',
        timestamp: '2019-02-06T00:43:01.965Z'
      },
      {
        coordinates: 'maven/mavencentral/com.squareup.retrofit2/converter-scalars/2.5.0',
        timestamp: '2019-02-06T00:42:39.184Z'
      },
      {
        coordinates: 'maven/mavencentral/com.squareup.retrofit2/converter-gson/2.5.0',
        timestamp: '2019-02-06T00:41:59.243Z'
      },
      {
        coordinates: 'maven/mavencentral/com.squareup.retrofit2/adapter-rxjava2/2.5.0',
        timestamp: '2019-02-06T00:31:46.698Z'
      },
      {
        coordinates: 'nuget/nuget/-/microsoft.applicationinsights.web/2.9.0',
        timestamp: '2019-02-05T23:47:03.798Z'
      },
      {
        coordinates: 'pypi/pypi/-/boto3/1.9.88',
        timestamp: '2019-02-05T23:39:34.688Z'
      },
      {
        coordinates: 'npm/npmjs/-/vscode-azureappservice/0.29.2',
        timestamp: '2019-02-05T23:21:56.347Z'
      },
      {
        coordinates: 'npm/npmjs/-/yasway/1.5.14',
        timestamp: '2019-02-05T23:13:38.357Z'
      },
      {
        coordinates: 'npm/npmjs/-/office-ui-fabric-react/6.134.0',
        timestamp: '2019-02-05T23:04:43.305Z'
      },
      {
        coordinates: 'npm/npmjs/-/shelving-mock-indexeddb/1.0.5',
        timestamp: '2019-02-05T22:52:03.646Z'
      },
      {
        coordinates: 'npm/npmjs/-/shelving-mock-event/1.0.12',
        timestamp: '2019-02-05T22:52:01.617Z'
      },
      {
        coordinates: 'npm/npmjs/-/service-worker-mock/2.0.0',
        timestamp: '2019-02-05T22:51:54.324Z'
      },
      {
        coordinates: 'npm/npmjs/-/npm-packlist/1.3.0',
        timestamp: '2019-02-05T22:49:10.285Z'
      },
      {
        coordinates: 'nuget/nuget/-/cpprestsdk.v.141/2.10.7',
        timestamp: '2019-02-05T22:47:23.173Z'
      },
      {
        coordinates: 'npm/npmjs/-/tsconfig-paths/3.8.0',
        timestamp: '2019-02-05T22:34:24.746Z'
      },
      {
        coordinates: 'npm/npmjs/@types/mime/2.0.1',
        timestamp: '2019-02-05T22:26:01.858Z'
      },
      {
        coordinates: 'npm/npmjs/-/azure-pipelines-language-service/0.5.4',
        timestamp: '2019-02-05T21:59:37.802Z'
      },
      {
        coordinates: 'npm/npmjs/@emotion/unitless/0.7.3',
        timestamp: '2019-02-05T21:45:57.161Z'
      },
      {
        coordinates: 'npm/npmjs/@emotion/memoize/0.7.1',
        timestamp: '2019-02-05T21:45:46.254Z'
      },
      {
        coordinates: 'npm/npmjs/@emotion/is-prop-valid/0.7.3',
        timestamp: '2019-02-05T21:45:43.105Z'
      },
      {
        coordinates: 'npm/npmjs/@fortawesome/fontawesome-free/5.7.1',
        timestamp: '2019-02-05T21:41:57.712Z'
      },
      {
        coordinates: 'nuget/nuget/-/microsoft.dotnet.web.projecttemplates.2.2/2.2.1',
        timestamp: '2019-02-05T21:38:15.523Z'
      },
      {
        coordinates: 'nuget/nuget/-/microsoft.dotnet.web.spa.projecttemplates/2.2.1',
        timestamp: '2019-02-05T21:38:08.37Z'
      },
      {
        coordinates: 'nuget/nuget/-/nunit3.dotnetnew.template/1.6.0',
        timestamp: '2019-02-05T21:37:51.105Z'
      },
      {
        coordinates: 'nuget/nuget/-/microsoft.dotnet.web.itemtemplates/2.2.1',
        timestamp: '2019-02-05T21:37:38.246Z'
      },
      {
        coordinates: 'nuget/nuget/-/dotnet-watch/2.2.0',
        timestamp: '2019-02-05T21:37:30.323Z'
      },
      {
        coordinates: 'nuget/nuget/-/dotnet-sql-cache/2.2.0',
        timestamp: '2019-02-05T21:37:28.102Z'
      },
      {
        coordinates: 'nuget/nuget/-/dotnet-user-secrets/2.2.0',
        timestamp: '2019-02-05T21:37:27.606Z'
      },
      {
        coordinates: 'nuget/nuget/-/dotnet-ef/2.2.1',
        timestamp: '2019-02-05T21:37:26.175Z'
      },
      {
        coordinates: 'nuget/nuget/-/dotnet-dev-certs/2.2.0',
        timestamp: '2019-02-05T21:37:21.159Z'
      },
      {
        coordinates: 'npm/npmjs/@octokit/rest/15.18.1',
        timestamp: '2019-02-05T21:33:33.36Z'
      }
    ]
    this.state = {
      requestsPerDay: Object.keys(temp).map(date => {
        return { date: new Date(date).toLocaleDateString(), count: temp[date] }
      }),
      definitionAvailability: Object.keys(dA).map(name => {
        return { name, value: dA[name] }
      }),
      crawledPerDay: cD.map(entry => {
        entry.date = new Date(entry.date).toLocaleDateString()
        return entry
      }),
      recentlyCrawled: rC.map(entry => {
        entry.timestamp = new Date(entry.timestamp).toLocaleString()
        return entry
      })
    }
  }

  render() {
    return (
      <Grid className="main-container">
        <Row>
          <h2>Requests / day</h2>
          {this.renderRequestsPerDay()}
        </Row>
        <hr />
        <Row>
          <Col md={6}>
            <h2>Definition availability</h2>
            {this.renderDefinitionAvailabilityTable()}
          </Col>
          <Col md={6}>{this.renderDefinitionAvailabilityChart()}</Col>
        </Row>
        <hr />
        <Row>
          <h2>Components processed / day</h2>
          {this.renderComponentsProcessed()}
        </Row>
        <hr />
        <Row>
          <h2>Recently crawled components</h2>
          {this.renderRecentlyCrawled()}
        </Row>
      </Grid>
    )
  }

  renderRequestsPerDay() {
    return (
      <ResponsiveContainer height={500}>
        <LineChart data={this.state.requestsPerDay}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke={colors[0]} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  renderDefinitionAvailabilityTable() {
    return (
      <table>
        <tbody>
          {this.state.definitionAvailability.map((entry, index) => {
            return (
              <tr>
                <td>
                  <span
                    style={{
                      backgroundColor: colors[index % colors.length],
                      height: '20px',
                      width: '20px',
                      marginRight: '10px',
                      display: 'inline-block'
                    }}
                  />
                </td>
                <td>
                  <h3>{entry.name}</h3>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  renderDefinitionAvailabilityChart() {
    return (
      <ResponsiveContainer height={500}>
        <PieChart>
          <Pie
            nameKey="name"
            dataKey="value"
            data={this.state.definitionAvailability}
            labelLine={false}
            label
            label={this.renderPieLabel}
            outerRadius={200}
            fill="#8884d8"
          >
            {this.state.definitionAvailability.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  renderComponentsProcessed() {
    return (
      <ResponsiveContainer height={500}>
        <BarChart data={this.state.crawledPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(
            this.state.crawledPerDay.reduce((result, entry) => {
              Object.keys(entry).forEach(x => {
                result[x] = 1
              })
              return result
            }, {})
          )
            .filter(x => x !== 'date')
            .map((host, index) => {
              return <Bar dataKey={host} fill={colors[index % colors.length]} stackId="a" />
            })}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  renderRecentlyCrawled() {
    return (
      <div>
        <Table>
          <tbody>
            {this.state.recentlyCrawled.map(entry => {
              return (
                <tr>
                  <td>{entry.timestamp}</td>
                  <td>
                    <a href={`/definitions/${entry.coordinates}`}>{entry.coordinates}</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
}
