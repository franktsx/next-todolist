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
 *   post:    
 *     postResponse:
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
 * tags:
 *   - name: Item List API
 *     description: Item list action API 
 *
 * /index:
 *   get:
 *     description: Query item list
 *     tags: [Get item list]
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
 * 
 *   post:
 *     description: Create item API
 *     tags: [Create item]
 *     produces:
 *       - application/json
 *     summary: Create a item in the list with form data
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
 *           $ref: '#/components/post/postResponse'
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect() // connect to database
      res.json(await Todo.find({}).catch(catcher))
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Todo } = await connect() // connect to database
      res.json(await Todo.create(req.body).catch(catcher))
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) response(req, res)
  else res.status(400).json({ error: "No Response for This Request" })
}

export default handler