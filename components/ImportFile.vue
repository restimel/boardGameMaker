<template>
    <section v-if="!!exportOptions"
        class="export-area"
    >
        <button
            class="main-button export-button"
            @click.stop.prevent="exportFile"
        >
            Export {{ fileType }}
        </button>
    </section>
    <label
        :class="{
            'file-import': true,
            error: !!error,
            'drag-over': isDragOver,
        }"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.stop.prevent="handleDrop"
    >
        <input
            type="file"
            :accept="acceptMIME"
            class="input-import-csv"
            @change.stop.prevent="handleFileSelect"
            ref="importFileInput"
        />

        <div v-if="isDragOver" class="drag-over-message">Drop file here</div>
        <div v-else>Click or drag and drop to import a {{ fileType }} file</div>

        <span class="error-message" v-if="error">
            {{ error }}
        </span>
    </label>
</template>
<script lang="ts" setup>
type Props = {
    fileType: 'CSV' | 'JSON';
    exportOptions?: {
        name?: string;
        content: object;
    };
};

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'import', value: any): void;
}>();

const error = ref<string>('');
const isDragOver = ref<boolean>(false);

const acceptMIME = computed<string>(() => {
    switch (props.fileType) {
        case 'CSV':
            return 'text/csv';
        case 'JSON':
            return 'app/json';
    }
});

function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        importFile(target.files[0]);
    }
}

function handleDragOver() {
    isDragOver.value = true;
};

function handleDragLeave() {
    isDragOver.value = false;
};

function handleDrop(event: DragEvent) {
    isDragOver.value = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        importFile(event.dataTransfer.files[0]);
    }
};

function exportFile(event: MouseEvent): boolean {
    const exportOptions = props.exportOptions;
    const element = event.currentTarget as HTMLButtonElement;

    if (!exportOptions) {
        element.setCustomValidity('No options available');
        element.reportValidity();
        return false;
    }

    element.setCustomValidity('');

    const content = exportOptions.content;

    switch (props.fileType) {
        case 'CSV':
            if (!Array.isArray(content)) {
                element.setCustomValidity('Data are not valid');
                element.reportValidity();
                return false;
            }

            exportToCSV(content, exportOptions.name);
            return true;

        case 'JSON':
            if (typeof content !== 'object') {
                element.setCustomValidity('Data are not valid');
                element.reportValidity();
                return false;
            }

            const result = exportToJSON(content, exportOptions.name);

            if (result) {
                element.setCustomValidity(result);
                element.reportValidity();
                return false;
            }

            return true;
    }
}

function importFile(file: File) {
    error.value = '';

    const reader = new FileReader();
    reader.onloadend = (evt) => {
        const text = evt.target?.result;

        if (text) {
            let values: object |  object[] | string;

            switch (props.fileType) {
                case 'CSV':
                    values = importFromCSV(String(text));
                    break;
                case 'JSON':
                    values = importFromJSON(String(text));
                    break;
            }

            if (typeof values === 'string') {
                error.value = `Failed to import file: ${values}`;
                return;
            }

            emit('import', values);
        }
    };

    reader.readAsText(file);
};

</script>
<style scoped>
.export-area {
    margin-bottom: 5px;
}

.file-import {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50%;
    border: 2px dashed var(--table-border);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
}

.input-import-csv {
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.file-import.drag-over {
    background: var(--active-bg);
}

.file-import.error {
    background: var(--error-bg-color);
}

.drag-over-message {
    color: var(--active-color);
}

.error-message {
    color: var(--error-color);
}

</style>
