import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { Chart, ChartTypeRegistry } from "chart.js";
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxMarqueeModule } from 'ngx-marquee';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-charts-page',
  imports: [ButtonModule, TableModule, InputTextModule, CommonModule, FormsModule, ChartModule, CardModule, PopoverModule, SliderModule, MultiSelectModule, DialogModule, ColorPickerModule,
    RadioButtonModule, NgxMarqueeModule, ToggleSwitchModule, ToastModule, InputNumberModule, CheckboxModule
  ],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.scss',
  providers: [MessageService]
})
export class ChartsPageComponent {
  @ViewChild('attachment') attachment: any;
  // first page variables
  chart: any;
  table_headers: any = [];
  table_data: any = [];
  isDarkMode = false;
  primeng_charts_data: any;
  opted_charts: any = []
  charts_list: any = [
    { label: 'Bar', value: 'bar', index_axis: 'x' },
    { label: 'Stacked Bar', value: 'stacked_bar', index_axis: 'x' },
    { label: 'Line', value: 'line', index_axis: 'x' },
    { label: 'Radar', value: 'radar', index_axis: 'x' },
    // { label: 'Pie', value: 'pie' },
    // { label: 'Doughnut', value: 'doughnut' }
    // { label: 'Bubble', value: 'bubble' },
    // { label: 'Scatter', value: 'scatter' }
  ]
  show_global_settings: boolean = false;
  index_options: any = [
    { label: 'X', value: 'x' },
    { label: 'Y', value: 'y' }
  ];
  is_fill: boolean = false
  selected_individual_chart: any;
  opted_charts_list: any = [];
  first_page: boolean = true;
  duplicate_table_data: any = [];
  uploaded_file: boolean = false;
  loader: boolean = false;
  primeng_lines_charts_data: any;
  constructor(private messageService: MessageService) { }
  brightness: any = [40, 120]
  defalt_color: any = '#dadced';
  selected_records: any = []
  show_conform_dialog: boolean = false
  is_heatmap: boolean = false

  //second page variables
  compareData_options: any = [
    { label: 'By Brand', value: 'brand' },
    { label: 'By Country', value: 'Country' },
  ]
  opted_option: any = this.compareData_options[0];
  brands_list: any = [
    { label: 'Benepali' },
    { label: 'Enbrel' },
    { label: 'Erelzi' },
  ]
  countries_list: any = [
    { label: 'France' },
    { label: 'Germany' },
    { label: 'Italy' },
    { label: 'Spain' }
  ]

  selected_options: any = [this.brands_list[0]];
  exper_charts_data: any = [];

  second_table_headers: any = [];
  second_table_data: any = [];

  title = 'hackathon_prototype';

  data: any[] = [];
  cols: any[] = [];
  ngOnInit() {
    this.brightness = 100
    this.opted_charts = [this.charts_list[0]];
    this.opted_charts_list = this.opted_charts.map((x: any) => x.value);
    // console.log(this.opted_charts, this.opted_charts_list)
    setTimeout(() => {
      this.construct_charts_data();
      this.construct_chartsJS_charts_data('bar');
    }, 500);

    this.table_headers = [
      { label: 'Year', value: 'label' },
      { label: 'Lyrica', value: 'jan' },
      { label: 'Cymbalta', value: 'feb' },
      { label: 'Lexapro', value: 'mar' },
      { label: 'Duloxetine lilly', value: 'apr' },
      { label: 'Pregabalin Pfizer', value: 'may' },
      // { label: 'Drug 6', value: 'jun' },
      // { label: 'Drug 7', value: 'jul' },
    ];
    if (sessionStorage.getItem('tab_data')) {
      const data: any = sessionStorage.getItem('tab_data')
      const existing_data = JSON.parse(data)
      this.table_data = existing_data
    } else {
      this.table_data = [
        {
          ds: 1,
          jan: '65',
          feb: '59',
          mar: '80',
          apr: '81',
          may: '56',
          jun: '55',
          jul: '40',
          bg_color: 'skyblue',//'var(--p-cyan-100)',
          border_color: 'skyblue',//'var(--p-cyan-100)',
          border_radius: 5,
          label: '2021',
          chartjs_bg_color: 'green',
          chartjs_border_color: 'green',
          fill: false,
          tension: 0.4,
        },
        {
          ds: 2,
          jan: '28',
          feb: '48',
          mar: '40',
          apr: '19',
          may: '86',
          jun: '27',
          jul: '90',
          bg_color: 'orange',//'var(--p-orange-100)',
          border_color: 'orange',//'var(--p-orange-100)',
          border_radius: 10,
          label: '2022',
          fill: false,
          chartjs_bg_color: 'yellow',
          chartjs_border_color: 'yellow',
        },
        {
          ds: 2,
          jan: '8',
          feb: '88',
          mar: '20',
          apr: '39',
          may: '56',
          jun: '67',
          jul: '9',
          bg_color: 'yellow',//'var(--p-orange-100)',
          border_color: 'yellow',//'var(--p-orange-100)',
          border_radius: 10,
          label: '2023',
          fill: false,
          chartjs_bg_color: 'orange',
          chartjs_border_color: 'orange',
        }
      ];
    }
    console.log(this.table_data)
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeClass = this.isDarkMode ? 'theme-dark' : 'theme-light';
    document.body.className = themeClass;
  }

  construct_charts_data(chart_type?: any) {
    console.log('constructing chart data...', this.table_headers, this.table_data, this.opted_charts,this.opted_charts_list);
    const labels = this.table_headers.slice(1).map((header: any) => header?.label);
    let datasets : any
    let lines_data_set :any
    this.opted_charts.forEach((ele:any) => {
      if(ele?.label != 'Line' && ele?.label != 'Radar') {
        datasets = this.table_data.map((product: any) => ({
          label: product.label,
          backgroundColor: product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
          borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
          data: this.table_headers.slice(1).map((header: any) => product[header.value]),
          borderWidth: product?.border_width,//1,
          borderRadius: product?.border_radius, //5,
          fill: false,
          // borderDash: [10, 10], 
          tension: 0.1,
        }));
      } else {
        lines_data_set = this.table_data.map((product: any) => ({
          label: product.label,
          backgroundColor: product?.fill === true ? 'rgba(107, 114, 128, 0.2)' : product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
          borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
          data: this.table_headers.slice(1).map((header: any) => product[header.value]),
          borderWidth: product?.border_width,//1,
          borderRadius: product?.border_radius, //5,
          fill: product?.fill,
          // borderDash: [10, 10], 
          tension: 0.1,
        }));
      }
    });
    this.primeng_charts_data = {
      labels: labels,
      datasets: datasets
    };
    this.primeng_lines_charts_data = {
      labels: labels,
      datasets: lines_data_set
    };
    console.log(this.primeng_charts_data);
  }

  construct_chartsJS_charts_data(data?: any) {
    console.log(data, this.opted_charts)
    // let type: keyof ChartTypeRegistry = data == 2 ? 'line' : data == 3 ? 'radar' : 'bar';
    const datasets = this.table_data.map((product: any) => ({
      label: product.label,
      backgroundColor: product.chartjs_bg_color,
      borderColor: product.chartjs_border_color,
      data: this.table_headers.slice(1).map((header: any) => product[header.value]),
      borderWidth: 1,
      borderRadius: product?.border_radius//5,
    }));
    if (!data) {
      console.log('jkhdjhdjhjhj')
    }
    if (data) {
      console.log(data)
      // console.log('afjshfhj',this.opted_charts[data].value)
      this.chart = new Chart(`${data}`, {
        // type: `${type}`,
        // type: this.opted_charts[data].value == 'stacked_bar' ? 'bar' :this.opted_charts[data].value ,
        type: data == 'stacked_bar' ? 'bar' : data,
        data: {
          labels: this.table_headers.slice(1).map((header: any) => header?.label),
          datasets: datasets
        },
        options: {
          // plugins: {
          //   title: {
          //     display: true,
          //     text: 'Chart.js Bar Chart - Stacked'
          //   },
          // },
          responsive: true,
          scales: {
            x: {
              // stacked: this.opted_charts[data].value == 'stacked_bar' ? true : false,
              stacked: data == 'stacked_bar' ? true : false,
            },
            y: {
              stacked: data == 'stacked_bar' ? true : false,
            }
          }
        }
      });
      console.log(this.chart)
    }
  }

  someFunction(fun?: any, row_data?: any) {
    console.log('function called...', fun, row_data);
    console.log(this.table_data)
    sessionStorage.setItem('tab_data', JSON.stringify(this.table_data))
    this.construct_charts_data();
    // for (let i = 1; i <= this.table_data?.length; i++) {
    //   const chartInstance = Chart.getChart(`canvas${i}`);
    //   if (chartInstance) {
    //     chartInstance.destroy();
    //   }
    //   setTimeout(() => {
    //     this.construct_chartsJS_charts_data(i)
    //   }, 10);
    // }
    if (this.opted_charts && this.opted_charts.length > 0) {
      for (let i = 1; i <= this.opted_charts.length; i++) {
        const chartInstance = Chart.getChart(`${this.opted_charts[i - 1]?.value}`);
        if (chartInstance) {
          chartInstance.destroy();
        }
        console.log(this.opted_charts[i - 1]?.value)
        setTimeout(() => {
          console.log(this.opted_charts[i - 1]?.value)
          this.construct_chartsJS_charts_data(this.opted_charts[i - 1]?.value)
        }, 10);
      }
    }
  }
  on_select_icon(from?: any) {
    this.brightness = 100
  }

  add_new(from?: any) {
    console.log('adding new...', from);
    switch (from) {
      case 'column':
        this.table_headers = [...this.table_headers, { label: '', value: '' }]
        break;
      case 'row':
        this.table_data = [...this.table_data, {
          ds: Math.random() * 100,
          jan: '',
          feb: '',
          mar: '',
          apr: '',
          may: '',
          jun: '',
          jul: '',
          // bg_color: 'var(--p-cyan-100)',
          // border_color: 'var(--p-cyan-100)',
          label: '',
          chartjs_bg_color: '',
          chartjs_border_color: '',
        }]
        this.calculate_average()
        break;
      case 'del':
        this.duplicate_table_data = this.table_data
        this.show_conform_dialog = true
        break;
      default:
        break;
    }
    console.log(this.table_headers, this.table_data);
  }

  calculate_average() {
    const tableDataKeys = Object.keys(this.table_data[0]);
    const tableheaderKeys = this.table_headers?.map((x: any) => x.value);
    console.log(tableDataKeys, tableheaderKeys)
    const total_counts_obj: any = {}
    this.table_data?.forEach((ele: any, i: any) => {
      console.log(i, ele)
      if (i < this.table_data?.length) {
        this.table_headers?.forEach((hdr: any, j: any) => {
          if (j > 0) {
            console.log(j, hdr?.value, tableDataKeys?.includes(hdr?.value))
            if (tableDataKeys?.includes(hdr?.value)) {
              console.log('hit here', this.table_data[this.table_data?.length - 1])
            }
          }
        });
      }
    });


    // for (const product of this.table_data) {
    //   console.log(product)

    //   // totalPrice += product.price;
    //   // totalQuantity += product.quantity;
    // }

  }

  on_change_values(evnt?: any) {
    console.log(evnt, this.opted_charts);
    this.opted_charts_list = this.opted_charts.map((x: any) => x.value);
    console.log(this.opted_charts_list)
    this.construct_charts_data();
    if (this.opted_charts && this.opted_charts.length > 0) {
      for (let i = 1; i <= this.opted_charts.length; i++) {
        const chartInstance = Chart.getChart(`${this.opted_charts[i - 1]?.value}`);
        if (chartInstance) {
          chartInstance.destroy();
        }
        console.log(this.opted_charts[i - 1]?.value)
        setTimeout(() => {
          console.log(this.opted_charts[i - 1]?.value)
          this.construct_chartsJS_charts_data(this.opted_charts[i - 1]?.value)
          // this.construct_charts_data(this.opted_charts[i-1]);
        }, 10);
      }
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color)
    return color;
  }

  global_settings_dialog(from?: any) {
    if (from == 'primeng_main') {
      this.show_global_settings = true;
    }
    console.log('checking table data', this.table_data)
  }

  update_global_settings(evnt?: any, chart?: any, from?: any) {
    console.log(evnt, chart, from);
    if (chart == 'screen') {
      document.body.style.backgroundColor = evnt?.value;
    } else {
      console.log('shjfbshvfh', evnt, chart)
      // if (from == 'border_width') {
      //   chart.border_width = evnt?.value
      // } else {
      //   chart.bg_color = evnt?.value
      //   chart.border_color = evnt?.value
      // }

      chart.bg_color = evnt?.value
      chart.border_color = evnt?.value

      this.table_data = [...this.table_data]
      this.construct_charts_data();
    }
  }

  update_indiv_settings(evnt?: any, data?: any, from?: any) {
    console.log(evnt, data)
    if (from == 'border_radius') {
      data.border_radius = evnt?.value
    } else if (from == 'fill') {
      data.fill = evnt?.checked
    } else {
      data.border_width = evnt?.value
    }
    this.table_data = [...this.table_data]
    this.construct_charts_data();
  }

  chart_settings(chart?: any) {
    console.log('chart settings clicked...', chart)
    this.selected_individual_chart = chart;
  }
  opted_index: any = this.index_options[0];
  change_index_axis(evnt?: any) {
    console.log(evnt, this.selected_individual_chart, this.charts_list, this.opted_charts, this.opted_index)
    this.opted_charts = this.opted_charts?.filter((x: any) => x.label == this.selected_individual_chart.label ? (x.index_axis = this.opted_index?.value) : x)
    console.log(this.opted_charts)
    this.construct_charts_data();
  }

  on_click(from?: any) {
    console.log(from)
    if (from == 'back') {
      this.first_page = true
      setTimeout(() => {
        this.construct_charts_data();
        if (this.opted_charts && this.opted_charts.length > 0) {
          for (let i = 1; i <= this.opted_charts.length; i++) {
            const chartInstance = Chart.getChart(`${this.opted_charts[i - 1]?.value}`);
            if (chartInstance) {
              chartInstance.destroy();
            }
            console.log(this.opted_charts[i - 1]?.value)
            setTimeout(() => {
              console.log(this.opted_charts[i - 1]?.value)
              this.construct_chartsJS_charts_data(this.opted_charts[i - 1]?.value)
            }, 10);
          }
        }
        // this.construct_chartsJS_charts_data();
      }, 500);
    } else {
      this.first_page = false
      this.generate_comparasion_charts(this.selected_options[0])
    }
  }

  generate_comparasion_charts(opted?: any, index?: any) {
    console.log('hittoing her', opted, index, this.opted_option)
    this.second_table_headers = [
      { label: '2010', value: '2010' },
      { label: '2015', value: '2015' },
      { label: '2020', value: '2020' },
      { label: '2025', value: '2025' },
      // { label: '2004', value: '2004' },
    ];
    this.second_table_data = [
      {
        countries_data: [{
          ds: '1',
          2010: opted?.label == 'Enbrel' ? '1008' : opted?.label == 'Benepali' ? '0' : '0',
          2015: opted?.label == 'Enbrel' ? '718' : opted?.label == 'Benepali' ? '0' : '0',
          2020: opted?.label == 'Enbrel' ? '549' : opted?.label == 'Benepali' ? '481' : '481',
          2025: opted?.label == 'Enbrel' ? '412' : opted?.label == 'Benepali' ? '411' : '412',
          // 2004: opted?.label == 'Enbrel' ? '2' : opted?.label == 'Benepali' ? '10' : '56',
          bg_color: 'orange',//'var(--p-cyan-100)',
          border_color: 'orange',//'var(--p-cyan-100)',
          border_radius: 5,
          label: 'France',
        },
        {
          ds: '2',
          2010: opted?.label == 'Enbrel' ? '1407' : opted?.label == 'Benepali' ? '0' : '0',
          2015: opted?.label == 'Enbrel' ? '1407' : opted?.label == 'Benepali' ? '0' : '0',
          2020: opted?.label == 'Enbrel' ? '1120' : opted?.label == 'Benepali' ? '894' : '774',
          2025: opted?.label == 'Enbrel' ? '732' : opted?.label == 'Benepali' ? '732' : '725',
          // 2004: opted?.label == 'Enbrel' ? '5' : opted?.label == 'Benepali' ? '44' : '86',
          bg_color: 'blue',//'var(--p-orange-100)',
          border_color: 'blue',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Germany',
        },
        {
          ds: '2',
          2010: opted?.label == 'Enbrel' ? '1020' : opted?.label == 'Benepali' ? '0' : '0',
          2015: opted?.label == 'Enbrel' ? '1020' : opted?.label == 'Benepali' ? '0' : '0',
          2020: opted?.label == 'Enbrel' ? '1020' : opted?.label == 'Benepali' ? '696' : '663',
          2025: opted?.label == 'Enbrel' ? '1020' : opted?.label == 'Benepali' ? '696' : '663',
          // 2004: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '47',
          bg_color: 'green',//'var(--p-orange-100)',
          border_color: 'green',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Italy',
        },
        {
          ds: '2',
          2010: opted?.label == 'Enbrel' ? '947' : opted?.label == 'Benepali' ? '0' : '0',
          2015: opted?.label == 'Enbrel' ? '756' : opted?.label == 'Benepali' ? '0' : '0',
          2020: opted?.label == 'Enbrel' ? '676' : opted?.label == 'Benepali' ? '760' : '676',
          2025: opted?.label == 'Enbrel' ? '676' : opted?.label == 'Benepali' ? '760' :'676',
          // 2004: opted?.label == 'Enbrel' ? '65' : opted?.label == 'Benepali' ? '1' : '12',
          bg_color: 'yellow',//'var(--p-orange-100)',
          border_color: 'yellow',//'var(--p-orange-100)',
          border_radius: 10,
          label: 'Spain',
        }],
        brands_data: [
          {
            ds: '1',
            2010: opted?.label == 'France' ? '0' : opted?.label == 'Germany' ? '0' : opted?.label == 'Italy' ? '0' : '0',
            2015: opted?.label == 'France' ? '0' : opted?.label == 'Germany' ? '0' : opted?.label == 'Italy' ? '0' : '0',
            2020: opted?.label == 'France' ? '481' : opted?.label == 'Germany' ? '894' : opted?.label == 'Italy' ? '696' : '760',
            2025: opted?.label == 'France' ? '411' : opted?.label == 'Germany' ? '732' : opted?.label == 'Italy' ? '696' : '760',
            // 2004: opted?.label == 'France' ? '2' : opted?.label == 'Germany' ? '10' : opted?.label == 'Italy' ? '47' : '56',
            bg_color: 'orange',//'var(--p-cyan-100)',
            border_color: 'orange',//'var(--p-cyan-100)',
            border_radius: 5,
            label: 'Benepali',
          },
          {
            ds: '2',
            2010: opted?.label == 'France' ? '1008' : opted?.label == 'Germany' ? '1407' : opted?.label == 'Italy' ? '1020' : '947',
            2015: opted?.label == 'France' ? '718' : opted?.label == 'Germany' ? '1407' : opted?.label == 'Italy' ? '1020' : '756',
            2020: opted?.label == 'France' ? '549' : opted?.label == 'Germany' ? '1120' : opted?.label == 'Italy' ? '1020' : '676',
            2025: opted?.label == 'France' ? '412' : opted?.label == 'Germany' ? '732' : opted?.label == 'Italy' ? '1020' : '676',
            // 2004: opted?.label == 'France' ? '5' : opted?.label == 'Germany' ? '44' : opted?.label == 'Italy' ? '89' : '86',
            bg_color: 'blue',//'var(--p-orange-100)',
            border_color: 'blue',//'var(--p-orange-100)',
            border_radius: 10,
            label: 'Enbrel',
          },
          {
            ds: '2',
            2010: opted?.label == 'France' ? '0' : opted?.label == 'Germany' ? '0' : opted?.label == 'Italy' ? '0' : '0',
            2015: opted?.label == 'France' ? '0' : opted?.label == 'Germany' ? '0' : opted?.label == 'Italy' ? '0' : '0',
            2020: opted?.label == 'France' ? '481' : opted?.label == 'Germany' ? '774' : opted?.label == 'Italy' ? '663' : '676',
            2025: opted?.label == 'France' ? '412' : opted?.label == 'Germany' ? '725' : opted?.label == 'Italy' ? '663' : '676',
            // 2004: opted?.label == 'France' ? '65' : opted?.label == 'Germany' ? '1' : opted?.label == 'Italy' ? '63' : '47',
            bg_color: 'green',//'var(--p-orange-100)',
            border_color: 'green',//'var(--p-orange-100)',
            border_radius: 10,
            label: 'Erelzi',
          }
        ]
      }
    ];
    console.log(this.second_table_data, this.second_table_headers)
    let data_to_loop = this.opted_option?.label == 'By Country' ? this.second_table_data[0]?.brands_data : this.second_table_data[0]?.countries_data
    console.log(data_to_loop)
    const labels = this.second_table_headers.map((header: any) => header?.label);
    const datasets = data_to_loop.map((product: any) => ({
      label: product.label,
      backgroundColor: product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
      borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
      data: this.second_table_headers.map((header: any) => product[header.value]),
      borderWidth: product?.border_width,//1,
      borderRadius: product?.border_radius, //5,
      fill: false,
      // borderDash: [5, 5],
      // tension: 0.1,

    }));
    if (opted?.label) {
      const obj: any = {
        brand: opted?.label,
        data_bind: {
          labels: labels,
          datasets: datasets
        }
      }
      this.exper_charts_data?.push(obj);
      this.exper_charts_data = [...new Set(this.exper_charts_data)]
      console.log([...new Set(this.exper_charts_data)]); //exper_charts_data
    }
  }

  on_change_brandss(evnt?: any) {
    console.log(evnt)
    this.exper_charts_data = []
    evnt?.value.forEach((element: any, i: any) => {
      this.generate_comparasion_charts(element, i)
    });
  }

  on_click_radio_button(evnt?: any) {
    console.log(evnt, this.opted_option)
    this.exper_charts_data = []
    if (this.opted_option?.label == 'By Country') {
      this.selected_options = [this.countries_list[0]];
      console.log(this.selected_options)
    } else {
      this.selected_options = [this.brands_list[0]];
    }
    this.generate_comparasion_charts(this.selected_options[0])

  }

  confirm_del(evnt?: any) {
    console.log('sscscscs', evnt, this.table_data, this.selected_records)
    console.log(this.selected_records?.map((x: any) => x.ds))
    if (evnt == 'delete') {
      // const updatedArray = this.table_data.filter((obj:any) => !this.selected_records?.map((x:any)=>x.ds).includes(obj.ds));
      this.table_data = this.table_data.filter((obj: any) => !this.selected_records?.map((x: any) => x.ds).includes(obj.ds));
      console.log(this.table_data)
      this.show_conform_dialog = false
      this.selected_records = []
    } else {
      this.selected_records = []
      this.show_conform_dialog = false
    }
    sessionStorage.setItem('tab_data', JSON.stringify(this.table_data))
    this.on_change_values()
    // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });

  }

  on_sel_heatmap_option(evnt?: any) {
    console.log(this.is_heatmap, evnt)
  }

  onFileUpload(evnt?: any) {
    this.loader = true
    this.uploaded_file = true
    console.log('checkingupload ecel;', evnt.target.files[0])
    const file = evnt.target.files[0];
    const reader: FileReader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      this.loader = true
      const arrayBuffer: ArrayBuffer = e.target.result;
      const binaryString = new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
      const wb: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
      const wsname: string = wb.SheetNames[0]; // take first sheet
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Convert sheet to JSON
      const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      // Extract headers
      this.cols = (sheetData[0] as string[]).map((h: string) => ({ value: h, label: h }));

      // Extract rows
      this.data = sheetData.slice(1).map((row: any) => {
        this.loader = true
        const obj: any = {};
        this.cols.forEach((col, index) => {
          obj[col.value] = row[index];
        });
        return obj;
      });
      this.loader = false
    };
    setTimeout(() => {
      console.log(this.cols,this.data)
      this.loader = false
      // this.construct_charts_with_excel_data()
    }, 3000);
  }
  on_click_clear_file() {
    this.uploaded_file = false
    this.attachment.nativeElement.value = '';
  }

  construct_charts_with_excel_data() {
    console.log('constructing chart data...', this.cols, this.data);
    // const labels = this.cols.slice(1).map((header: any) => header?.label);
    const labels = this.cols.filter((x:any)=>x.label !='Brand' && x.label !== 'Country').map((header: any) => header?.label);
    const datasets = this.data.map((product: any) => ({
      label: product.Country,
      // backgroundColor: product?.fill === true ? 'rgba(107, 114, 128, 0.2)' : product?.bg_color,//getComputedStyle(document.documentElement).getPropertyValue('var(--p-cyan-100)'),
      // borderColor: product.border_color,//getComputedStyle(document.documentElement).getPropertyValue(product.border_color),
      data: this.cols.filter((x:any)=>x.label !='Brand' && x.label !== 'Country').map((header: any) => product[header.value]),
      borderWidth: 1,//product?.border_width,//1,
      borderRadius: 3,//product?.border_radius, //5,
      fill: false,
      // borderDash: [10, 10], 
      tension: 0.1,
    }));
    this.primeng_charts_data = {
      labels: labels,
      datasets: datasets
    };
    console.log(this.primeng_charts_data);
  }
}
