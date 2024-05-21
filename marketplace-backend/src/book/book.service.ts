import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import * as moongoose from 'mongoose'
import { CreateBookDto } from './dto/createbook.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { user } from 'src/auth/schemas/user.schema';
import {Query} from 'express-serve-static-core'

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: moongoose.Model<Book>
    ) {}

    async findAll(query: Query) {
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage -1);
        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: "i"
            }
        } : {}        
        const books = this.bookModel.find(keyword).limit(resPerPage).skip(skip);
        return books
    }

    async create(book: CreateBookDto, User: user) {

        const data = Object.assign(book, {User: User._id})
        const res = await this.bookModel.create(book)
        return res;
    }

    async findById(id: string) {
        const isValidId = moongoose.isValidObjectId(id)

        if(!isValidId) throw new BadRequestException("Enter Valid Id")
        const book = await this.bookModel.findById(id)
        if(!book) throw new NotFoundException("Book not found")
        return book
    }

    async updateById(id: string, book: UpdateBookDto) {
         return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        }) 
    }

    async deleteById(id: string) {
        return await this.bookModel.findByIdAndDelete(id)
    }
}
