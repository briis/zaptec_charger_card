import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const watching = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/zaptec-charger-card.js',
  output: {
    file: 'dist/zaptec-charger-card.js',
    format: 'es',
    sourcemap: watching ? 'inline' : false,
  },
  plugins: [
    resolve(),
    !watching && terser(),
  ].filter(Boolean),
};
