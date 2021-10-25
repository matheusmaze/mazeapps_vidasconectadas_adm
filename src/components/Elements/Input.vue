<template>
  <template v-if="type == 'default'">
    <label class="block relative">
      <span
        class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm"
        >{{ label }}</span
      >
      <div v-if="readonly">
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          readonly
          disabled
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      <div v-else>
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      
    </label>
  </template>


<template v-if="type == 'password'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <input
      class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="(event) => $emit('update:modelValue', event.target.value)"
    />
    <p
      v-if="modelValue && modelValue.length > 0 && showTip"
      class="font-bold text-gray-800 mt-1 text-right"
    >
      Nível:
      <span
        :class="
          passwordStrength(modelValue) == 'Forte'
            ? 'text-green-400'
            : passwordStrength(modelValue) == 'Moderada'
            ? 'text-yellow-400'
            : 'text-red-400'
        "
        >{{ passwordStrength(modelValue) }}</span
      >
    </p>
  </label>
</template>

<template v-if="type == 'select'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <select
      :value="`${modelValue === '' ? 0 : modelValue }`"
      @change="(event) => $emit('update:modelValue', event.target.value)"
      class="border rounded-lg bg-white py-4 focus:outline-white form-input mt-1 pl-6 block w-full px-4 form-select"
    >
      <option value="0" selected disabled>{{ placeholder }}</option>
      <template v-for="item in data" :key="item.label">
        <option :value="item.value">{{ item.label }}</option>
      </template>
    </select>
  </label>
</template>

<template v-if="type == 'datalist'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <input 
      type="text" 
      :value="modelValue" 
      list="list"
      @change="(event) => $emit('update:modelValue', event.target.value)"
      class="border rounded-lg bg-white appearance-none py-4 focus:outline-white form-input mt-1 pl-6 block w-full px-4 form-select text-sm"
    />
    <datalist id="list">
      <template v-for="item in data" :key="item.label">
        <option>{{ item.label }}</option>
      </template>
    </datalist>
  </label>
</template>

<template v-if="type == 'checkbox'">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <div class="flex auto border flex-wrap rounded-lg bg-white appearance-none py-4">
      <div class="flex mr-3 w-40 py-1" v-for="item in data" :key="item.label">      
        <div class="flex items-center h-5 ml-2"> <!-- flex flex-wrap flex-auto flex-col-->      
          <input 
            type="checkbox" 
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            :id="item.value" 
            :value="item.value"
            :checked="modelValue.find(el => el == item.value)"
            @change="(event) => $emit('update:modelValue',
              !modelValue.includes(event.target.value) ?
                event.target.value.split().concat(modelValue)
              : modelValue.filter((value) => {
                return value != event.target.value
              })
            )">
        </div>
        <div class="ml-1 text-sm">
          <label :for="item.value" class="font-medium text-gray-700 "> {{ item.label }} </label>
        </div>
      </div>
    </div>
</template>


<template v-if="type == 'date'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <div v-if="readonly">
      <input
        class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        readonly
        disabled
        @input="(event) => $emit('update:modelValue', event.target.value)"
      />
    </div>
    <div v-else>
      <input
        class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="(event) => $emit('update:modelValue', event.target.value)"
      />
    </div>
  </label>
</template>
<template v-if="type == 'birthday'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <div v-if="readonly">
      <input
        class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
        inputmode="numeric" 
        :placeholder="placeholder"
        :value="modelValue"
        readonly
        disabled
        @input="(event) => $emit('update:modelValue', event.target.value)"
      />
    </div>
    <div v-else>
      <input
        class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
        inputmode="numeric" 
        :placeholder="placeholder"
        :value="modelValue"
        v-maska="'##/##/####'"
        @input="(event) => $emit('update:modelValue', event.target.value)"
      />
    </div>
  </label>
</template>

<template v-if="type == 'time'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <input
      class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="(event) => $emit('update:modelValue', event.target.value)"
    />
  </label>
</template>

<template v-if="type == 'money'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <input
      class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full"
      :placeholder="placeholder"
      :value="modelValue"
      @keyup="(event) => $emit('update:modelValue', formaterMoney(event.target.value))"
    />
  </label>
</template>

<template v-if="type == 'cep'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <input
      class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
      :placeholder="placeholder"
      :value="modelValue"
      v-maska="'#####-###'"
      v-on:blur="functions.action(modelValue)"
      @keyup="(event) => $emit('update:modelValue', event.target.value)"
    />
  </label>
</template>

<template v-if="type == 'image'">
    <div class="relative">
      <img
        :class="width ? `w-${width} rounded-lg shadow-lg` : 'max-w-xs rounded-lg shadow-lg'"
        :src="tempImage ? readURL(tempImage) : 'https://via.placeholder.com/500'"
      />
      <button v-if="!readonly"
        class="bg-ternary rounded-md shadow-md transform hover:scale-105 px-5 py-2 absolute flex justify-center items-center font-bold"
        style="bottom: 20px; left: 20px"
      >
        <label class="text-white" :for="label">{{ placeholder ? `${placeholder}` : `Adicionar`}}</label> <i class="ml-3 text-white gg-camera"></i>
        <input
        @change="(event) => { $emit('update:modelValue', (event.target.files[0])); tempImage = event.target.files[0]}"
        class="absolute hidden" :id="label" type="file" />

      </button>
    </div>
</template>


<template v-if="type == 'textarea'">
  <label class="block relative">
    <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
      label
    }}</span>
    <textarea
      v-if="readonly"
      class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
      :placeholder="placeholder"
      :value="modelValue"
      readonly
      disabled
      @change="(event) => $emit('update:modelValue', (event.target.value))"
    >
    </textarea>
    <textarea v-else
      class="border rounded-lg py-4 appearance-none focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
      :placeholder="placeholder"
      :value="modelValue"
      @change="(event) => $emit('update:modelValue', (event.target.value))"
    >
    </textarea>
  </label>
</template>

<template v-if="type == 'color'">
  <label class="block relative">
    <div class="flex">
      <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
        label
      }}</span>
      <input
        class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="(event) => $emit('update:modelValue', event.target.value)"
      />
      <input
        class="mt-1 w-8 h-8 border-0 absolute left-36 top-4  text-sm"
        :placeholder="placeholder"
        :value="modelValue"
        type="color"
        @change="(event) => $emit('update:modelValue', event.target.value)"
      />
    </div>  
  </label>
</template>

<template v-if="type == 'cnpj'">
    <label class="block relative">
      <span
        class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm"
        >{{ label }}</span
      >
      <div v-if="readonly">
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          readonly
          disabled
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      <div v-else>
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          v-maska="'##.###.###/####-##'"
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      
    </label>
  </template>

  <template v-if="type == 'cpf'">
    <label class="block relative">
      <span
        class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm"
        >{{ label }}</span
      >
      <div v-if="readonly">
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          readonly
          disabled
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      <div v-else>
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          v-maska="'###.###.###-##'"
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      
    </label>
  </template>

  <template v-if="type == 'cpf_cnpj'">
    <label class="block relative">
      <span
        class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm"
        >{{ label }}</span
      >
      <div v-if="readonly">
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          readonly
          disabled
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      <div v-else>
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          v-maska="['###.###.###-##', '##.###.###/####-##']"
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      
    </label>
  </template>

  <template v-if="type == 'whats'">
    <label class="block relative">
      <span
        class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm"
        >{{ label }}</span
      >
      <div v-if="readonly">
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm text-gray-500"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          readonly
          disabled
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      <div v-else>
        <input
          class="border rounded-lg py-4 focus:outline-white form-input mt-1 pl-6 block w-full text-sm"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          v-maska="'(##) #####-####'"
          @input="(event) => $emit('update:modelValue', event.target.value)"
        />
      </div>
      
    </label>
  </template>

  <template v-if="type == 'radio'">
    <div class="flex flex-col relative auto border rounded-lg bg-white appearance-none py-4 ">
      <span class="text-gray-700 bg-white px-3 -top-2 left-4 absolute text-sm">{{
        label
      }}</span>
      <div class="flex mt-2 mr-3" v-for="item in data" :key="item.label">      
        <div class="flex items-center h-5 ml-2">  
          <label class="font-medium text-gray-700 ">
            <input 
              type="radio" 
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              :name="name"
              :value="item.value"
              :checked="modelValue === item.value"
              @change="(event) => $emit('update:modelValue', event.target.value)"
            />
            {{ item.label }}
          </label>
        </div>
      </div>
    </div>
</template>

</template>

<script>
import { computed, onRenderTracked, ref } from "vue";
import { passwordStrength } from "../../services/util";
export default {
  props: {
    label: String || null,
    placeholder: String || null,
    name: String || null,
    type: String || null,
    modelValue: String || Array,
    data: Array || null,
    showTip: Boolean,
    width: Number || null,
    functions: Object || null,
    readonly: Boolean || null
  },
  setup(props, { emit }) {
      const tempImage = ref();
      computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
      });
      
      onRenderTracked(() => {
        if(props.type == 'image'){
          tempImage.value = props.modelValue
        }
      })


      const readURL = file => {
        if(typeof(file) == 'string'){
          return file
        }
        return window.URL.createObjectURL(file)
      };

    
    const formaterMoney = (num) => {
        let valor = num;

        if(valor){
          valor = valor + '';
          valor = parseInt(valor.replace(/[\D]+/g, ''));
          valor = valor + '';
          valor = valor.replace(/([0-9]{2})$/g, ",$1");

          if (valor.length > 6) {
            valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
          }
        } else {
          valor = "";
        }

        return 'R$ ' + valor
    }

    return { props, passwordStrength, formaterMoney, tempImage, readURL };
  },
};
</script>

<style>

</style>