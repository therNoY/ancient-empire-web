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
                this.onDialogCreate();
            } else {
                this.onDialogDestroy();
            }
        }
    },
    created() {
        this.showModel = this.value;
    },
    destroyed() {
        this.onDialogDestroy();
    },
}
