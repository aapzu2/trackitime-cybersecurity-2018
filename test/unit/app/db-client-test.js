
var assert = require('assert')
var proxyquire = require('proxyquire')
var dbClientUrl = "../../../app/db-client"

describe('DBClient', function() {


    beforeEach(function() {
        process.env.DATABASE_URL = "test"
    })

    afterEach(function() {

    })

    it('should throw error if no DATABASE_URL set', function() {
        var oldDbUrl = process.env.DATABASE_URL
        delete process.env["DATABASE_URL"]
        assert.throws(function() {
            require(dbClientUrl)
        }, function(err) {
            if ( (err instanceof Error) && /DATABASE_URL/.test(err) ) {
                return true;
            }
        })
        process.env.DATABASE_URL = oldDbUrl
    })

    it('should throw error if client.connect returns error', function() {
        assert.throws(function() {
            proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function(host) {
                        this.connect = function(cb) {
                            cb(new Error('test'))
                        }
                    }
                }
            })
        }, function(err) {
            if ( (err instanceof Error) && /test/.test(err) ) {
                return true;
            }
        })
    })

    it('should call client.connect', function(done) {
        proxyquire(dbClientUrl, {
            'pg': {
                defaults: {
                    ssl: false
                },
                Client: function(host) {
                    this.connect = function(cb) {
                        done()
                    }
                }
            }
        })
    })

    describe('query', function() {
        it('should call client.query with right arguments', function(done) {
            var dbClient = proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function() {
                        this.connect = function () {}
                        this.query = function(query, params) {
                            assert.equal(query, "test")
                            assert.deepEqual(params, ["test1", "test2"])
                            done()
                        }
                    }
                }
            })
            dbClient.query("test", ["test1", "test2"])
        })

        it('should work right with errors', function(done) {
            var dbClient = proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function() {
                        this.connect = function () {}
                        this.query = function(query, params, cb) {
                            cb(new Error("test"))
                        }
                    }
                }
            })
            dbClient.query("test", ["test1", "test2"])
                .catch(function(err) {
                    assert.equal(err.message, "test")
                    done()
                })
        })

        it('should work right with "callbacks"', function() {
            var dbClient = proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function() {
                        this.connect = function () {}
                        this.query = function(query, params, cb) {
                            cb(null, [{
                                a:1
                            },{
                                b:2
                            }])
                        }
                    }
                }
            })
            dbClient.query("test", ["test1", "test2"])
                .then(function(rows) {
                    assert.equal(rows[0].a, 1)
                    assert.equal(rows[1].b, 2)
                    done()
                })
        })
    })

    describe('first', function() {
        it('should call this.query with right args', function(done) {
            var dbClient = proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function () {
                        this.connect = function () {}
                    }
                }
            })
            dbClient.query = function(query, params) {
                assert.equal(query, "test")
                assert.deepEqual(params, ["test1", "test2"])
                done()
            }
            dbClient.first("test", ["test1", "test2"])
        })

        it('should return only one object, not list', function(done) {
            var dbClient = proxyquire(dbClientUrl, {
                pg: {
                    defaults: {
                        ssl: false
                    },
                    Client: function () {
                        this.connect = function () {
                        }
                    }
                }
            })
            dbClient.query = function(query, params) {
                return new Promise(function(resolve) {
                    resolve([{
                        a: 1
                    }])
                })
            }
            dbClient.first("test", [])
                .then(function(item){
                    assert(!item.length)
                    assert.equal(item.a, 1)
                    done()
                })
        })
    })
})