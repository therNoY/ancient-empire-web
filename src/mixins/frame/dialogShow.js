export default {
    props: {
        value: {
            type: Boolean,
        },
    },
    data() {
        return {
            showModel: "",
        };
    },
    watch: {
        showModel(value) {
            this.$emit("input", value);
        },
        value(v) {
            this.showModel = v;
            if (v) {
                if (this.onDialogCreate && this.onDialogCreate instanceof Function) {
                    this.onDialogCreate();
                }
            } else {
                if (this.onDialogDestroy && this.onDialogDestroy instanceof Function) {
                    this.onDialogDestroy();
                }
            }
        }
    },
    created() {
        this.showModel = this.value;
    },
    destroyed() {
        if (this.onDialogDestroy && this.onDialogDestroy instanceof Function) {
            this.onDialogDestroy();
        }
    },
}
