class ProjectSampleDatatable < ApplicationDatatable
  private

  def data
    samples.map do |sample|
      [].tap do |column|
        column << ""
        @config.each do |attr|
          if attr != 'id'
            column << "<div class='table_cell'> #{sample[attr]} </div>"
          else
            column << sample[attr]
          end
        end
        project_id = Sample.find(sample['id']).project_id
        column << "<button class='btn btn-1'> #{link_to('Show', "/projects/#{project_id}/samples/#{sample['id']}")} </button>"
      end
    end
  end

  def count
    @obj.length()
  end

  def total_entries
    fetch_filtered.length()
    
    # will_paginate
    # users.total_entries
  end

  def samples
      fetch_samples
  end

  def fetch_filtered
    search_string = []
    @config.each do |attr|
      # if Sample.columns_hash[attr].type != :string
      #   search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
      # else
      search_string << "\"#{attr}\" like :search"
      # end
    end
    # search_col =['sample_name', 'project_name', 'experiment_type']
    # search_col.each do |term|
    #   search_string << "#{term} like :search"
    # end
    


    # will_paginate
    # users = User.page(page).per_page(per_page)
    # samples = @obj.samples.order("#{sort_column} #{sort_direction}")

    # @obj = @obj.slice(0, 5)
    # puts sort_column
    # puts sort_direction
    # puts @obj[0][sort_column]
    if sort_direction == "asc"
      reorder_obj = @obj.sort_by { |s_record| s_record[sort_column] }
    else
      reorder_obj = @obj.sort_by { |s_record| s_record[sort_column] }.reverse!

    end
    #samples = @obj.slice(obj_start, per_page)
    if params[:search][:value] != ""
      search_values = params[:search][:value]
      # @obj.each do |s_record|
      samples = []
      reorder_obj.each do |s_record|
        @config.each do |attr|
          if s_record[attr].to_s.include? search_values.to_s
            samples.push(s_record)
            break
          end
        end
      end
    else
      samples = reorder_obj
    end
    return samples
    #samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
  end

  def fetch_samples
    obj_start = (page-1) * per_page
    obj_end = obj_start + per_page
    samples = fetch_filtered
    samples = samples.slice(obj_start, per_page)
    #samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
    return samples
  end

  def columns
    @config
    # %w(first_name last_name email phone_number)
  end

  # def sort_direction
  #   params[:order]['0'][:dir] == "desc" ? "desc" : "asc"
  # end

end
