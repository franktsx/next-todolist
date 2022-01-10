import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { ResponseFuncs } from "../../../utils/types"

/**
 * @swagger
 *
 * components:
 *   query:
 *     getResponse:
 *        type: object
 *        properties:
 *          _id: 
 *             type: number
 *          item: 
 *             type: string
 *          completed: 
 *             type: boolean
 *          priority: 
 *             type: string
 *   del:    
 *     getResponse:
 *        type: object
 *        properties:
 *          _id: 
 *             type: number
 *          item: 
 *             type: string
 *          completed: 
 *             type: boolean
 *          priority: 
 *             type: string
 *   put:    
 *     getResponse:
 *        type: object
 *        properties:
 *          _id: 
 *             type: number
 *          item: 
 *             type: string
 *          completed: 
 *             type: boolean
 *          priority: 
 *             type: string
 *
 * /[id]:
 *   get:
 *     description: Query item info
 *     tags: [Get item info]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         in: query
 *         required: true
 *         type: number
 *         description: Item id
 *     responses:
 *       201:
 *         description: query successed
 *         schema:
 *           $ref: '#/components/query/getResponse'
 *       400:
 *         description: No Response for This Request
 *   delete:
 *     description: Delete item
 *     tags: [Delete item]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         in: query
 *         required: true
 *         type: number
 *         description: Item id
 *     responses:
 *       201:
 *         description: deleted completed
 *         schema:
 *           $ref: '#/components/del/getResponse'
 *       400:
 *         description: No Response for This Request
 *   put:
 *     description: Update item info
 *     tags: [Update item info]
 *     produces:
 *       - application/json
 *     summary: Updates a item in the store with form data
 *     parameters:
 *       - name: _id
 *         in: query
 *         required: true
 *         schema:
 *            type: number
 *         description: Item id
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties: 
 *                  item: 
 *                     description: Updated name of the item
 *                     type: string
 *                  completed:
 *                     description: Updated completed of the item
 *                     type: boolean
 *                  priority:
 *                     description: Updated priority of the item
 *                     type: string
 *     responses:
 *       201:
 *         description: item updated
 *         schema:
 *           $ref: '#/components/put/getResponse'
 *       400:
 *         description: No Response for This Request
 */
 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect() // connect to database
      res.json(await Todo.findById(id).catch(catcher))
    },
    // RESPONSE PUT REQUESTS
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect() // connect to database
      res.json(
        await Todo.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher)
      )
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect() // connect to database
      res.json(await Todo.findByIdAndRemove(id).catch(catcher))
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler