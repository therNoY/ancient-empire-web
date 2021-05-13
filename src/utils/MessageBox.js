import Vue from 'vue';
import messageVue from "../components/frame/base/AeMessage"
const defaults = {
    show:false,
    text:'',
    duration:'3000',
    type:''
};
const messageVueConstructor = Vue.extend(messageVue);
messageVueConstructor.prototype.close = function() {
  var vm=this;
  this.$on('after-leave', _ => {
    if (vm.$el && vm.$el.parentNode) {
      vm.$el.parentNode.removeChild(vm.$el);
    }
    this.$destroy();
  });
    vm.show = false;

};
const messageBox = (options = {}) => {
    if (Vue.prototype.$isServer) return;
    options = Object.assign({}, defaults, options);
    let parent = document.body ;
    let instance = new messageVueConstructor({
      el: document.createElement('div'),
      data: options
    });
    parent.appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.show = true;
      setTimeout(function(){
        instance.close();
      },options.duration)
    });


    return instance;
  };

  export default messageBox;
