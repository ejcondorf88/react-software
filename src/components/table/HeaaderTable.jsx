import { InputText } from 'primereact/inputtext';

export const HeaderTable = () => {
    
       
    
    
    return (
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter((e.target).value)}
            placeholder="Search..."
            className="p-2"
          />
        </span>
      </div>
        
        
    )
}