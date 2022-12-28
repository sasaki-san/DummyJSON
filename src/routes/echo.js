const router = require('express').Router();
const algorithms = require("../algo")

/**
 * Echo the request query with a hashed password
 */
router.get('/:algo', async (req, res) => {
  if (req.query.error) {
    res.status = 404;
    return res.send({
      message: "Not found"
    })
  }

  const { algo } = req.params;

  const algorithm = algorithms[algo]({
    ...req.query
  })

  algorithm.calc()
  const calculatedParams = await algorithm.calculatedParams()
  const value = algorithm.result()

  res.send({
    ...req.query,
    ...calculatedParams,
    password: value
  })
});

/**
 * Echo the request query
 */
router.get('/', async (req, res) => {
  if (req.query.error) {
    res.status = 404;
    return res.send({
      message: "Not found"
    })
  }

  return res.send({
    ...req.query,
  })
});


module.exports = router;
