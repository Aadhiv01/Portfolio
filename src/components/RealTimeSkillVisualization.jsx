import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RealTimeSkillVisualization = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const skills = [
      { name: 'JavaScript', value: 90 },
      { name: 'React', value: 85 },
      { name: 'Node.js', value: 80 },
      { name: 'Python', value: 75 },
      { name: 'SQL', value: 70 },
    ];

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .domain(skills.map(d => d.name))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, 100]);

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('fill', 'royalblue')
      .selectAll('rect')
      .data(skills)
      .join('rect')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.value))
        .attr('height', d => y(0) - y(d.value))
        .attr('width', x.bandwidth());

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('transform', `translate(${margin.left},0)`);

    svg.append('g')
      .call(d3.axisBottom(x))
      .attr('transform', `translate(0,${height - margin.bottom})`);

  }, []);

  return <svg ref={svgRef} width="600" height="400"></svg>;
};

export default RealTimeSkillVisualization;
