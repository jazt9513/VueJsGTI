
Vue.component('producto-resenia', {
  template: `
  <form class="resenia-form" @submit.prevent="enviar">
    <p v-if="errores.length">
      <b>Por favor corriga los siguientes errores: </b>
      <ul>
        <li v-for="error in errores">{{ error }}</li>
      </ul>
    </p>
    <p>
      <label for="nombre">Nombre:</label>
      <input id="nombre" v-model="nombre" placeholder="Nombre">
    </p>
    
    <p>
      <label for="resenia">Reseña:</label>      
      <textarea id="resenia" v-model="resenia"></textarea>
    </p>
    
    <p>
      <label for="calificacion">Calificación:</label>
      <select id="calificacion" v-model="calificacion">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Enviar">  
    </p>    

  </form>
  `,
  data(){
    return{
      nombre: null,
      resenia: null,
      calificacion: null,
      errores: []
    }
  },
  methods:{
    enviar(){
      this.errores = [];
      if(this.nombre && this.resenia && this.calificacion){
        var productoResenia = {
          nombre: this.nombre,
          resenia: this.resenia,
          calificacion: this.calificacion
        }
        this.$emit('resenia-enviada', productoResenia)
        this.nombre= null,
        this.resenia= null,
        this.calificacion= null
      }else{
        if(!this.nombre) this.errores.push("El nombre es requerido");
        if(!this.resenia) this.errores.push("La resenia es requerida");
        if(!this.calificacion) this.errores.push("La calificación es requerida");
      }
    }
  }
})


Vue.component('producto', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: ` 
  <div class="producto">

      <div class="producto-imagen">
          <img :src="imagen" :alt="altText">
      </div>

      <div class="producto-info">
          <h1> {{ titulo }} </h1>
          <p v-if="enInventario" >En inventario</p>
          <p v-else>Agotado</p>
          <p>Envio: {{ envio }}</p>

          <ul>
              <li v-for="detalle in detalles">{{ detalle }}</li>
          </ul>

          <div class="color-caja" 
              v-for="(variante, index) in variantes" 
              :key="variante.varianteId"
              @mouseover="actualizarProducto(index)" 
              :style="{ backgroundColor: variante.varianteColor}" >
          </div>

          <button @click="agregarAlCarrito"
                  :disabled="!enInventario"
                  :class="{ disabledButton : !enInventario }">
          Agregar al carrito</button>

      </div>

      <div>
        <h2>Reseñas</h2>
          <p v-if="!resenias.length">No hay reseñas todavia.</p>
          <ul>
              <li v-for="resenia in resenias">
                  <p>{{ resenia.nombre }}</p>
                  <p>Calificación: {{ resenia.calificacion }}</p>
                  <p>{{ resenia.resenia }}</p>
              </li>
          </ul>
      </div>

    <producto-resenia @resenia-enviada="agregarResenia"></producto-resenia>
  </div>
  `,
  data(){
    return {
      producto: "Smartphone",
      marca: "Iphone XR",
      varianteSeleccionada: 0,
      altText: "Smartphone",
      detalles: ["Pantalla: 5.8","Procesador: Apple A11 Bionic", "RAM: 3GB"],
      variantes: [
        {
          varianteId: 1,
          varianteColor: "black",
          varianteImagen: "assets/iphone_negro.jpg",
          varianteCantidad: 10
        },
        {
          varianteId: 2,
          varianteColor: "white",
          varianteImagen: "assets/iphone_blanco.jpg",
          varianteCantidad: 0
        }
      ],
      resenias: []
    }
  },
  methods: {
    agregarAlCarrito: function(){
      this.$emit('agregar-al-carrito', this.variantes[this.varianteSeleccionada].varianteId);
    },
    actualizarProducto(index){
      this.varianteSeleccionada = index;
    },
    agregarResenia(productoResenia){
      this.resenias.push(productoResenia);
    }
  },
  computed: {
    titulo(){
      return this.producto + ' ' + this.marca;
    },
    imagen(){
      return this.variantes[this.varianteSeleccionada].varianteImagen;
    },
    enInventario(){
      return this.variantes[this.varianteSeleccionada].varianteCantidad;
    },
    envio(){
      if(this.premium){
        return "Gratis";
      }else {
        return "599.99";
      }
    }
  }

});


var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    carrito: []
  },
  methods: {
    actualizarCarrito(id){
      this.carrito.push(id);
    }
  }
  
});