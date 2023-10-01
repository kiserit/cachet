import { it } from 'vitest';
import { describe, expect } from 'vitest';
import { IncomingMessage, ServerResponse } from 'http';
import cachet from './index';

const cachetOptions = {
  param: 'v',
  cache: 'no-store',  
  ext: ['js','css'],
  version: '0.0.1',
}

const cachetHandler = cachet(cachetOptions)


describe('Redirecting', () => {

  it("should add ?v= query parameter", () => {
    let cacheControl: string = ''
    
    const req = Object.create(IncomingMessage.prototype)
    req.url = 'http://localhost:3000/test.css'
    req.query = { }
    req.path = '/test.css'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => {
      if (name == 'Cache-Control') {
        cacheControl = value
      }
    }

    res.redirect = (location: string) => {
      expect(cacheControl).toBe(cachetOptions.cache);
      expect(location).toBe(`${req.url}?v=0.0.1`);
    }
    const next = (err?: any) => {
      expect(true).toBe(false);
    }
    cachetHandler(req, res, next)
  });

  it("should add &v= query parameter", () => {
    let cacheControl: string = ''
    
    const req = Object.create(IncomingMessage.prototype)    
    req.url = 'http://localhost:3000/test.css?name=test'
    req.query = { name: 'test' }
    req.path = '/test.css'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => {
      if (name == 'Cache-Control') {
        cacheControl = value
      }
    }

    res.redirect = (location: string) => {
      expect(cacheControl).toBe(cachetOptions.cache);
      expect(location).toBe(`${req.url}&v=0.0.1`);
    }
    const next = (err?: any) => {
      expect(true).toBe(false);
    }
    cachetHandler(req, res, next)
  });

  it("should do nothing as ?v= already exists", () => {
    
    const req = Object.create(IncomingMessage.prototype)    
    req.url = 'http://localhost:3000/test.css?v=123'
    req.query = { v: '123' }
    req.path = '/test.css'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => { 
      expect(1).toBe(2);
    }
    res.redirect = (location: string) => {
      expect(1).toBe(2);
    }
    const next = (err?: any) => {
      expect(1).toBe(1);
    }
    cachetHandler(req, res, next)
  });

  it("should do nothing as file extension invalid", () => {
    
    const req = Object.create(IncomingMessage.prototype)    
    req.url = 'http://localhost:3000/test.svg'
    req.query = { }
    req.path = '/test.svg'

    const res = Object.create(ServerResponse.prototype)
    res.header = (name: string, value: string) => { 
      expect(1).toBe(2);
    }
    res.redirect = (location: string) => {
      expect(1).toBe(2);
    }
    const next = (err?: any) => {
      expect(1).toBe(1);
    }
    cachetHandler(req, res, next)
  });

});

