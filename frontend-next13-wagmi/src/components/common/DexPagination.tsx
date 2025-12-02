import { SetStateAction } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"


type DexPaginationProps = {
    page: number,
    totalPages: number | undefined
    setPage: (value: SetStateAction<number>) => void
}
const DexPagination: React.FC<DexPaginationProps> = ({page, totalPages, setPage}) => {
    return (
       
        <Pagination>
            <PaginationContent>
                <PaginationItem onClick={() => page > 1 ? setPage(page - 1) : {}}>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem onClick={() => setPage(Math.floor((page - 1) / 3) * 3 + 1)}>
                    <PaginationLink href="#" isActive = {page === Math.floor((page - 1) / 3) * 3 + 1 ? true : false}>{Math.floor((page - 1) / 3) * 3 + 1}</PaginationLink>
                </PaginationItem>
                {
                        totalPages && Math.floor((page - 1) / 3) * 3 + 2 <= totalPages
                        && 
                        <>
                        <PaginationItem onClick={() => setPage(Math.floor((page - 1) / 3) * 3 + 2)}>
                            <PaginationLink href="#" isActive = {page === Math.floor((page - 1) / 3) * 3 + 2 ? true : false}>{Math.floor((page - 1) / 3) * 3 + 2}</PaginationLink>
                        </PaginationItem>
                        </>
                }
                {
                    totalPages && Math.floor((page - 1) / 3) * 3 + 3 <= totalPages
                    && 
                    <>
                        <PaginationItem onClick={() => setPage(Math.floor((page - 1) / 3) * 3 + 3)}>
                            <PaginationLink href="#" isActive = {page === Math.floor((page - 1) / 3) * 3 + 3 ? true : false}>{Math.floor((page - 1) / 3) * 3 + 3}</PaginationLink>
                        </PaginationItem>
                    </>
                }
                {
                    totalPages && page < totalPages
                    &&
                    <>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                }
                <PaginationItem onClick={() => totalPages && page < totalPages ? setPage(page + 1) : {}}>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default DexPagination