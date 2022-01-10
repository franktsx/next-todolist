import React, {useState} from 'react'
import {render, fireEvent} from '@testing-library/react'
import Index, { getServerSideProps } from '../pages/index'

const todoList = [
    {_id:1, item:"haha", completed:false, priority:"2"},
    {_id:2, item:"wawa", completed:false, priority:"1"}
];

const props = {
    todos: [
        {
            _id: 1,
            item: "haha",
            completed: false,
            priority: "2"
        },
        {
            _id: 2,
            item: "wawa",
            completed: false,
            priority: "1"
        },
    ]
}

const SearchInput = () => {
    // const [filteredResults, setFilteredResults] = useState(todoList);
    const [value, setValue] = useState('');
  
    const getReturnValue = (value: string) => (value === '' ? '' : `$${value}`)
  
    // const searchItems = (e: string) => {
    //     if (e !== '') {
    //       const filteredData = todoList.filter((item) => {
    //         return Object.values(item).join('').toLowerCase().includes(e.toLowerCase())
    //       })
    //       setFilteredResults(filteredData)
    //     }else{
    //       setFilteredResults(todoList)
    //     }
    // }

    const handleChange = (ev: any) => {
      ev.preventDefault()
      const inputtedValue = ev.currentTarget.value
      if (isNaN(inputtedValue)) return
    //   searchItems(inputtedValue)
      setValue(getReturnValue(inputtedValue))
    }
  
    return <input value={value} aria-label="search" onChange={handleChange} />
  }

const setup = () => {
    const utils = render(<SearchInput />)
    const input = utils.getByLabelText('search')
    return {
      input,
      ...utils,
    }
}

describe('Should render <Index />', () => {
    it('should render <Index />', () => {
        const index = render(<Index todos={props.todos}/>);
        expect(index).toBeTruthy()
    });

    // it("check on good case", async () => {
    //     const value = await getServerSideProps();
    //     expect(value).toEqual({props: {_id:1, item:"haha", completed:false, priority:"2"}});
    // });

    it('we should have todos 1 and 2', () => {
        expect(todoList).toEqual(
            expect.arrayContaining([
                expect.objectContaining({_id: 1}),
                expect.objectContaining({_id: 2}),
            ])
        );
    });

    it('It should allow the item to be search', () => {
        const {input} = setup()
        fireEvent.change(input, {target: {value: 'haha'}})
        expect(todoList).toEqual(
            expect.arrayContaining([
                expect.objectContaining({_id: 1})
            ])
        );
    })
})