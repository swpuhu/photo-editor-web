type FilePickerOption = {
    multiple: boolean;
    excludeAcceptAllOption: boolean;
    types: {
        description: string;
        accept: Record<string, string[]>
    }[]
}

type DirectoryPickerOption = {
    id: number,
    mode: 'read' | 'readwrite',
    startIn: FileSystemHandle | 'desktop' | 'documents' | 'downloads' | 'music' | 'videos' | 'pictures'
}

type SavePickerOption = {
    excludeAcceptAllOption: boolean;
    suggestedName: string;
    types: {
        description: string;
        accept: Record<string, string[]>
    }[]
}

declare var showOpenFilePicker: (option?: FilePickerOption) => Promise<FileSystemFileHandle[]>
declare var showDirectoryPicker: (option?: DirectoryPickerOption) => Promise<FileSystemDirectoryHandle>
declare var showSaveFilePicker: (option?: SavePickerOption) => Promise<FileSystemFileHandle>