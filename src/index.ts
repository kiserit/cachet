import { join, extname } from 'path';
import { readFileSync, existsSync } from 'fs';


const DEFAULT_CACHE = 'no-store'
const DEFAULT_PARAM = 'v'
const DEFAULT_EXTS = ['js','css']


interface CachetNext {
  (err?: any): void;
}

interface CachetOptions {
  param?: string,
  cache?: string,
  ext?: string[]|boolean,
  version?: string,
}

interface CachetRequest {
  url: string,
  originalUrl: string,
  path: string,
  query: {
    [key: string]: string;
  }
}

interface CachetResponse {
  redirect: { (url: string): void },
  header: { (name: string, value: string): void },
  headersSent: boolean,
}


function getAppVersion(): string {
  if (process.env.npm_package_version) return process.env.npm_package_version;
  const cwd = process.cwd();
  for(let filename of ['./package.json', '../package.json', 
                       '../../package.json', '../../../package.json']) {
    try {
      const file = join(cwd, filename);
      if (existsSync(file)) {
        const contents = readFileSync(file, 'utf-8');
        if (contents) {
          const pkg = JSON.parse(contents);
          return pkg.version.replace(/[^0-9]/g, '');
        }
      }
    } catch { }
  }
  throw new Error('Unable to determine version of application.');
}


function cachet(options?: CachetOptions) {

  const optParam = ((options && options.param) ? options.param : DEFAULT_PARAM).replace(/\W/g,'');
  const optCache = (!options || typeof options.cache === undefined) ? DEFAULT_CACHE : options.cache;
  const optVersion = (options && options.version) ? options.version : getAppVersion();
  const optExt = (options && Array.isArray(options.ext)) ? options.ext : DEFAULT_EXTS
  const optExtAll = (options && options.ext === true)
  const extSet: Set<string> = new Set();


  if (!optExtAll) {
    for(let ext of optExt) {
      if (!ext) continue;
      if (ext.startsWith('.')) {
        extSet.add(ext.toLowerCase());
      } else {
        extSet.add('.'+ext.toLowerCase());
      }
    }
  }

  
  const cachetHandler = (req: CachetRequest, res: CachetResponse, next: CachetNext) => {
    if (!req.query || !(optParam in req.query)) {
      const url = req.originalUrl||req.url
      if (optExtAll) {
        const symbol = url.includes('?') ? '&' : '?';
        if (optCache) res.header('Cache-Control', optCache);
        return res.redirect(url+`${symbol}${optParam}=${optVersion}`);
      } else if (extSet.size > 0 && url.length > 1) {
        const ext = extname(req.path).toLowerCase();
        if (extSet.has(ext)) {
          const symbol = url.includes('?') ? '&' : '?';
          if (optCache) res.header('Cache-Control', optCache);
          return res.redirect(url+`${symbol}${optParam}=${optVersion}`);
        }
      }
    }    
    next();
  }

  return cachetHandler;
}

export = cachet;