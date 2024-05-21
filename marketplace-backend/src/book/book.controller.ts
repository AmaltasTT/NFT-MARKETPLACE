import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createbook.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import {Query as ExpressQuery} from 'express-serve-static-core'

@Controller('book')
export class BookController {
    constructor(
        private bookService: BookService
    ) { }

    @Get()
    findBooks(@Query() query: ExpressQuery) {
        return this.bookService.findAll(query)
    }

    @Get(':id')
    findBookById(
        @Param('id')
        id: string
    ) {
        return this.bookService.findById(id)
    }

    @Post()
    @UseGuards(AuthGuard())
    createBook(@Body() book: CreateBookDto,
        @Req() req) {
        return this.bookService.create(book, req.user)
    }

    @Put(':id')
    updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.bookService.updateById(id, updateBookDto)
    }

    @Delete(":id")
    deleteBook(@Param('id') id: string) {
        return this.bookService.deleteById(id)
    }
}
