<template>
  <div class="w-full overflow-hidden rounded-lg shadow-xs">
    <div class="w-full overflow-x-auto">
      <div class="bg-gray-50 py-3 flex w-full justify-between">
        <select
          v-model="perView"
          class="block px-3 mt-1 text-sm border bg-white form-select focus:border-gray-200 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-gray"
        >
          <option v-for="i in 5" :key="i" :value="i * 5">{{ i * 5 }}</option>
        </select>
        <div>
        <input
          v-model="query"
          :class="`border rounded-sm p-2 text-sm ${exports && 'mr-3'}`"
          placeholder="Pesquisar"
        />
        <button v-if="exports" class="btn bg-ternary text-sm p-2 rounded-md text-white" @click="exportCSVFile(headers, copyData, 'table')">Exportar para <b>CSV</b></button>
        </div>
      </div>

   
      
      <hr />
      <table
        v-if="copyData && data && copyData.length > 0"
        class="w-full h-full whitespace-no-wrap"
      >
        <thead>
          <tr
            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
          >
            <template v-for="header in headers" :key="header.value">
              <th class="px-4 py-4">
                <div
                  class="flex items-center cursor-pointer"
                  @click="
                    () =>
                      sortTable(
                        stateSort == 'dec' ? 'asc' : 'dec',
                        header.value,
                        typeof copyData[0][header.value]
                      )
                  "
                >
                  {{ header.key }}
                  <i class="gg-swap-vertical ml-2"></i>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="bg-white dark:divide-gray-700 dark:bg-gray-800">
          <template v-for="(item, index) in copyData" :key="item">
            <tr
              :class="`text-gray-700 ${
                index % 2 != 0 ? 'bg-gray-100' : ''
              } dark:text-gray-400`"
            >
              <template v-for="object in headers" :key="object">
                <div
                  class="flex-column relative h-full justify-center items-center"
                  v-if="object.photo"
                >
                  <img
                    class="h-10 w-10 absolute top-1.5 rounded-md"
                    :src="item[object.value]"
                  />
                </div>
                <template v-else>
                  <td v-if="object.value != ''" :class="`px-4 py-4 text-sm `">
                    <span v-if="object.date">
                      {{
                        object.deep
                          ? toDate(deep(item, object.value))
                          : toDate(item[object.value])
                      }}
                    </span>
                    <span v-else-if="object.datetime">
                      {{
                        object.deep
                          ? toDateTime(deep(item, object.value))
                          : toDateTime(item[object.value])
                      }}
                    </span>
                    <span v-else-if="object.money">
                      {{ toMoney(item[object.value]) }}
                    </span>
                    <span v-else-if="object.cpf">
                      {{ numberToCpf(item[object.value]) }}
                    </span>
                    <span v-else-if="object.cnpj">
                      {{ numberToCnpj(item[object.value]) }}
                    </span>
                    <span v-else-if="object.document">
                      <template v-if="item[object.value].length > 11">
                        {{ numberToCnpj(item[object.value]) }}
                      </template>
                      <template v-else>
                        {{ numberToCpf(item[object.value]) }}
                      </template>
                    </span>
                    <span v-else-if="object.copy">
                      <i
                        v-if="item[object.value] !== '' || item[object.value] !== undefined || item[object.value] !== null"
                        :class="`gg-copy cursor-pointer active:text-secondary`" 
                        title="Clique para copiar"
                        @click="(event) => copyContent(event.target, item[object.value])"
                      ></i>
                    </span>
                    <span
                      v-else
                      :class="` ${
                        object.badge
                          ? `px-3 py-1 rounded-full text-white capitalize bg-${
                              object.badge[item[object.value]]
                            }-500`
                          : ''
                      }`"
                      >{{
                        //object.deep
                        //  ? deep(item, object.value).length > 0
                        //    ? deep(item, object.value)
                        //    : ""
                        //  : object.badge
                        //  ? item[object.value] == 2
                        //    ? "Ativado"
                        //    : "Desativado"
                        //  : item[object.value]
                        item[object.value]
                      }}</span
                    >
                  </td>
                </template>
              </template>
              <td class="flex relative h-full items-center justify-start">
                <div
                  class="flex h-full absolute top-0 justify-between items-center space-x-4 text-sm"
                >
                  <template v-for="option in options" :key="option.icon">
                    <template v-if="option.route === 'comprador'">
                      <div @click="option.action(item)" v-if="item.status === 'Aguardando'">
                        <i
                          :title="option.title"
                          :class="`gg-${option.icon} mx-1 cursor-pointer hover:text-ternary`"
                        ></i>
                      </div>
                      <div v-else>
                        <div @click="option.action(item)" v-if="option.icon === 'pen'">
                          <i
                            :title="option.title"
                            :class="`gg-${option.icon} mx-1 cursor-pointer hover:text-ternary`"
                          ></i>
                        </div>
                        <div v-else>
                          <i
                            :class="`gg-${option.icon} mx-1 text-gray-300`"
                          ></i>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div @click="option.action(item)" v-if="!item['deleted_at']">
                        <div :class="`flex flex-col items-center`">
                          <i
                            :title="option.title"
                            :class="`gg-${option.icon} mx-1 hover:text-ternary`"
                          ></i>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <template v-else>
        <div
          class="bg-gray-100 text-center font-medium py-3 flex justify-center items-center opacity-25"
        >
          Nenhum item encontrado... <i class="ml-3 gg-ghost-character"></i>
        </div>
      </template>

      <div
        class="px-4 py-3 text-white flex justify-between text-xs font-semibold h-full w-full tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"
      >
        <span v-if="data" class="flex items-center col-span-3">
          Mostrando {{ indexPagination * perView }} -
          {{ copyData ? copyData.length : 0 + indexPagination * perView }} de
          {{ data ? data.length : 0 }}
        </span>
        <span class="col-span-2"></span>
        <span class="flex col-span-4 sm:justify-end">
          <nav aria-label="Table navigation">
            <ul class="inline-flex items-center">
              <li>
                <button
                  :class="`btn bg-ternary px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-${color}`"
                  aria-label="Previous"
                  v-if="indexPagination > 0"
                  @click="indexPagination--"
                >
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>

              <template v-for="position in sizeOfList" :key="position">
                <li v-if="position - 1 == indexPagination">
                  <button
                    :class="`btn bg-ternary px-3 py-1 transition-colors duration-150 bg-${color}  border border-r-0 rounded-md focus:outline-none focus:shadow-outline-${color}`"
                  >
                    {{ position }}
                  </button>
                </li>
                <li v-else>
                  <button
                    v-if="
                      position - 1 <= indexPagination + 3 &&
                      position > indexPagination - 1
                    "
                    @click="indexPagination = position - 1"
                    :class="`btn-outline bg-white px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-${color}`"
                  >
                    {{ position }}
                  </button>
                </li>
              </template>

              <li>
                <button
                  :class="`btn bg-ternary px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-${color}`"
                  aria-label="Next"
                  v-if="indexPagination < sizeOfList - 1"
                  @click="indexPagination++"
                >
                  <svg
                    class="w-4 h-4 fill-current"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref } from "vue";
import { toDate, toMoney, toDateTime, numberToCpf, numberToCnpj } from "../../services/formater";
export default {
  props: {
    headers: Array,
    data: Array,
    options: Array,
    color: String,
    exports: Boolean,
  },
  setup(props: any) {
    const query = ref("");
    const copyData: any = ref();
    const perView = ref(5);
    const pagination = ref();
    const indexPagination = ref(0);
    const sizeOfList = ref();
    const stateSort = ref("asc");

    const convertToCSV = (objArray) => {
      const temp = objArray
      const array = typeof objArray != "object" ? JSON.parse(temp) : temp;
      let str = "";

      for (let i = 0; i < array.length; i++) {
        let line = "";
        for (const index in array[i]) {
          if (line != "") line += ",";

          line += array[i][index];
        }

        str += line + "\r\n";
      }

      return str;
    };

    const exportCSVFile = (headers, items, fileTitle) => {
  
    // Convert Object to JSON
    const data = [...items]
    const head = headers.map(el => el.key)
    data.unshift(head)
    const jsonObject = JSON.stringify(data);


    const csv = convertToCSV(jsonObject);

    const exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    }



    const deep = (item: object, pos: string): any => {
      let payload = item;
      pos.split("][").map((el) => {
        payload = payload[el.replace(/[^\w\s]/gi, "")]
          ? payload[el.replace(/[^\w\s]/gi, "")]
          : payload;
      });

      return payload;
    };

    const find = (query: string) => {
      const response: Array<any | null> = [];
      props.data.map((item: object, index: number) => {
        Object.entries(item).map((element) => {
          if (!response.includes(props.data[index])) {
            if (String(element[1]).toLowerCase() === query.toLowerCase()) {
              response.unshift(props.data[index]); //Items Iguais!
            } else {
              if (
                String(element[1]).toLowerCase().includes(query.toLowerCase())
              ) {
                response.push(props.data[index]); //Items semelhantes!
              }
            }
          }
        });
      });
      return response;
    };

    const divide = (payload: Array<any> | any, divider: number | any) => {
      const divideArray = [...payload];
      return new Array(Math.ceil(divideArray.length / divider))
        .fill(null)
        .map(() => divideArray.splice(0, divider));
    };

    const sortTable = (type: string, key: string, param: any) => {
      stateSort.value = type;
      const sortData: Array<any> = [];

      pagination.value.map((el: Array<any>) => {
        el.map((item: object) => {
          sortData.push(item);
        });
      });

      if (param == "number") {
        if (type == "dec") {
          sortData.sort((a: any, b: any) => b[key] - a[key]);
        } else {
          sortData.sort((a: any, b: any) => a[key] - b[key]);
        }
      } else {
        if (type == "dec") {
          sortData.sort((a: any, b: any) =>
            String(b[key]).localeCompare(String(a[key]))
          );
        } else {
          sortData.sort((a: any, b: any) =>
            String(a[key]).localeCompare(String(b[key]))
          );
        }
      }

      pagination.value = divide(sortData, Number(perView.value));
      copyData.value = pagination.value[0];
    };

    const copyContent = (icon: Element, valueToBeCopied: string) => {
      const element = document.createElement('textarea');
      element.value = valueToBeCopied;
      element.setAttribute('readonly', '');
      element.style.position = 'absolute';                     
      element.style.left = '-9999px'; 
      document.body.appendChild(element);
      const selected =  document.getSelection()!.rangeCount > 0  ? document.getSelection()!.getRangeAt(0) : false;
      element.select();
      document.execCommand('copy');                 
      document.body.removeChild(element);                  
      if (selected) {                                 
        document.getSelection()!.removeAllRanges();    
        document.getSelection()!.addRange(selected);   
      }
      icon.setAttribute('title', 'Copiado!');
      setTimeout( () => {
        icon.setAttribute('title', 'Clique para copiar');
      }, 2000);
    }

    watch(props, () => {
      copyData.value = props.data;
      const divideData = divide(copyData.value, Number(perView.value));
      copyData.value = divideData[0];
      pagination.value = divideData;
      sizeOfList.value = pagination.value.length;
    });

    watch(query, () => {
      const result = find(query.value);
      if (result.length > 0) {
        pagination.value = divide(result, perView.value);
        copyData.value = pagination.value[0];
      } else {
        copyData.value = [];
      }
    });

    watch(perView, () => {
      pagination.value = divide(props.data, Number(perView.value));
      copyData.value = pagination.value[0];
      sizeOfList.value = pagination.value.length;
    });

    watch(indexPagination, () => {
      copyData.value = pagination.value[indexPagination.value];
    });

    return {
      query,
      props,
      copyData,
      perView,
      pagination,
      indexPagination,
      sizeOfList,
      sortTable,
      stateSort,
      toDate,
      toDateTime,
      toMoney,
      numberToCpf,
      numberToCnpj,
      deep,
      exportCSVFile,
      copyContent
    };
  },
};
</script>
<style scoped>
  .btn{
    color: #fff;
    margin: auto 3px;
  }
  .btn-outline{
    border: 1px solid #1C74B4;
    color: #1C74B4;
    margin: auto 3px;
  }
</style>
