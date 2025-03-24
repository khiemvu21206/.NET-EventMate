import React from 'react';  

interface HeaderTableRenderProps {  
    bindingsHeaderTable: { key: string; label: string }[];  
    onSort: (key: string) => void;  
    filterKey: string;  
    filterDirection: 'asc' | 'desc';  
}  

const HeaderTableRender: React.FC<HeaderTableRenderProps> = ({  
    bindingsHeaderTable,  
    onSort,  
    filterKey,  
    filterDirection,  
}) => {  
    return (  
        <>  
            {bindingsHeaderTable.map((header) => (  
                <div  
                    key={header.key}  
                    className="w-1/3 px-4 py-2 cursor-pointer"  
                    onClick={() => onSort(header.key)} // Call onSort with the header key  
                >  
                    <div className="flex items-center">  
                        <span>{header.label}</span>  
                        {filterKey === header.key && (  
                            <span>{filterDirection === 'asc' ? ' ▲' : ' ▼'}</span> // Display sort direction  
                        )}  
                    </div>  
                </div>  
            ))}  
        </>  
    );  
};  

export { HeaderTableRender };  