const React = require('react');
const { Document, Page, Text, pdf } = require('@react-pdf/renderer');

async function test() {
  try {
    const doc = React.createElement(Document, null,
      React.createElement(Page, null,
        React.createElement(Text, null, 'Test PDF in Node')
      )
    );
    const instance = pdf(doc);
    const blob = await instance.toBlob();
    console.log('toBlob succeeded! Size:', blob.size, 'type:', blob.type);
    const buffer = await instance.toBuffer();
    console.log('toBuffer succeeded! Length:', buffer.length);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
